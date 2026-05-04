import { useState, useEffect, useMemo } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useUserById, useToggleLockoutEnabled, useChangeUserStatus, useLdapGroups, useLdapUserById } from "@/features/security/users";
import styles from "./UserPanel.module.css";

// Models & Utils
import type { User } from "../../../model/types"; // Import yoluna diqqət et
import { ALL_ROLES } from "../../../model/consts";
import type { SelectionItem } from "../../../model/types";

// Components
import GroupSelectionModal from "../group-modal/GroupSelectionModal";
import { UserDetailView } from "./UserDetailView";

interface UserPanelProps {
  mode: 'create' | 'edit' | 'detail';
  selectedUser: User | null;
  onClose: () => void;
  onResetPassword: (user: User) => void;
  title?: string;
}

export const UserPanel = ({ mode, selectedUser, onClose, onResetPassword, title }: UserPanelProps) => {
  // --- STATE ---
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [localIsActive, setLocalIsActive] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [isRestricted, setIsRestricted] = useState(false); 

  // --- API HOOKS ---
  const { data: userDetailResponse, isLoading: isLoadingUserDetail } = useUserById(
    selectedUser?.id || null,
    mode === 'detail' && !!selectedUser
  );
  
  const userDetail = userDetailResponse?.result;
  const activeUser = userDetail || selectedUser; // Həmişə ən dolğun datanı istifadə et
  const ldapUserId = activeUser?.ldapUserId || null;

  // LDAP Data
  const { data: ldapGroupsResponse } = useLdapGroups(isGroupModalOpen);
  const { data: ldapUserResponse } = useLdapUserById(ldapUserId, isGroupModalOpen && !!ldapUserId);

  // Mutations
  const { mutate: toggleLockoutEnabled, isPending: isTogglingLockout } = useToggleLockoutEnabled();
  const { mutate: changeUserStatus, isPending: isChangingStatus } = useChangeUserStatus();

  // --- EFFECTS ---
  useEffect(() => {
    if (activeUser) {
      setLocalIsActive(activeUser.isActive);
      setIsRestricted(!!activeUser.lockoutEnd);
      setStatusMessage(null);
    }
  }, [activeUser]); 

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  // --- HANDLERS ---
  const handleToggleStatus = () => {
    if (!activeUser?.id) return;
    const newState = !localIsActive;
    
    setLocalIsActive(newState);
    setStatusMessage(newState 
      ? { type: 'success', text: "İstifadəçi aktiv edildi" } 
      : { type: 'error', text: "İstifadəçi deaktiv edildi" }
    );
    
    changeUserStatus({ userId: activeUser.id, isActive: newState }, {
      onError: () => {
        setLocalIsActive(!newState);
        setStatusMessage(null);
      }
    });
  };

  const handleToggleRestriction = () => {
    if (!activeUser?.id) return;
    toggleLockoutEnabled(activeUser.id, {
      onSuccess: () => setIsRestricted(!isRestricted)
    });
  };

  // LDAP Helper Logic
  const ldapGroupsAsSelectionItems: SelectionItem[] = useMemo(() => {
    return ldapGroupsResponse?.result?.map((group, index) => ({
      id: index + 1,
      name: group.samAccountName,
      groupId: group.id,
    })) || [];
  }, [ldapGroupsResponse?.result]);

  const selectedLdapGroups: SelectionItem[] = useMemo(() => {
    const memberOf = ldapUserResponse?.result?.memberOf || [];
    if (!memberOf.length) return [];
    
    const allGroups = ldapGroupsResponse?.result || [];
    return memberOf.map((memberId, index) => {
      const foundGroup = allGroups.find(group => group.id === memberId);
      return {
        id: index + 1,
        name: foundGroup ? foundGroup.name : memberId,
        groupId: memberId,
      };
    });
  }, [ldapUserResponse?.result?.memberOf, ldapGroupsResponse?.result]);

  return (
    <>
      <div className={styles.panelContainer}>
        {title && (
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>{title}</h3>
            <button onClick={onClose} className={styles.closeBtn} title="Bağla">
              <XMarkIcon width={20} />
            </button>
          </div>
        )}

        <div className={styles.panelBody}>
          {mode === 'detail' && (
            <UserDetailView
              user={activeUser}
              isLoading={isLoadingUserDetail}
              isActive={localIsActive}
              isRestricted={isRestricted}
              isChangingStatus={isChangingStatus}
              isTogglingLockout={isTogglingLockout}
              statusMessage={statusMessage}
              onToggleStatus={handleToggleStatus}
              onToggleRestriction={handleToggleRestriction}
              onPasswordChange={() => activeUser && onResetPassword(activeUser)}
              onLdapGroups={() => setIsGroupModalOpen(true)}
              onRoles={() => setIsRoleModalOpen(true)}
            />
          )}

          {(mode === 'edit' || mode === 'create') && (
             <div className={styles.placeholderForm}>
                Form Elementləri burada olacaq...
             </div>
          )}
        </div>
      </div>
      
      {/* Modallar */}
      <GroupSelectionModal 
        title="Qrup Seçimi"
        isOpen={isGroupModalOpen} 
        onClose={() => setIsGroupModalOpen(false)}
        sourceItems={ldapGroupsAsSelectionItems}
        initialSelectedItems={selectedLdapGroups}
        onSave={() => { }}
        isRoleSelection={false}
        ldapUserId={ldapUserId || undefined}
      />

      <GroupSelectionModal 
        title="Rolların Təyini"
        isOpen={isRoleModalOpen} 
        onClose={() => setIsRoleModalOpen(false)}
        sourceItems={ALL_ROLES}
        onSave={() => { }}
        isRoleSelection={true}
        userNodes={activeUser?.userNodes || []}
      />
    </>
  );
};