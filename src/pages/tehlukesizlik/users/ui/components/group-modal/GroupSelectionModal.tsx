import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import styles from "./GroupSelectionModal.module.css";
import { Modal } from "@/shared/ui/modal/base";
import { Button, CustomSelect } from "@/shared/ui"; 
import {
  ChevronRightIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import type { Option } from "@/shared/types"; 
import type { UserNode } from "@/features/security/users";
import { useUserRoles, useUserRolesByNodeId, useChangeUserRole, useChangeUserGroup } from "@/features/security/users";

export interface SelectionItem {
  id: number;
  name: string;
  groupId?: string;
}

interface GroupSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedItems: SelectionItem[]) => void;
  initialSelectedItems?: SelectionItem[];
  title?: string;
  sourceItems: SelectionItem[];
  isRoleSelection?: boolean; 
  userNodes?: UserNode[];
  userId?: string;
  ldapUserId?: string;
}

const EMPTY_LIST: SelectionItem[] = [];

const GroupSelectionModal: React.FC<GroupSelectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSelectedItems = EMPTY_LIST,
  title = "Seçim Paneli",
  sourceItems = [],
  isRoleSelection = false, 
  userNodes = [],
  ldapUserId,
}) => {
  const [leftList, setLeftList] = useState<SelectionItem[]>(sourceItems);
  const [rightList, setRightList] = useState<SelectionItem[]>(initialSelectedItems);
  const [leftSelectedIds, setLeftSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedUserNode, setSelectedUserNode] = useState<Option | null>(null);
  const listBoxRef = useRef<HTMLDivElement>(null);
  
  const shouldFetchAllRoles = isRoleSelection && isOpen; 
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (isRoleSelection) {
        setLeftList([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, isRoleSelection]);
  
  const {
    data: allRolesData,
    isLoading: isLoadingAllRoles,
    isFetching: isFetchingAllRoles,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useUserRoles(shouldFetchAllRoles, debouncedSearchTerm);
  

  const selectedNodeId = useMemo(() => {
    if (!selectedUserNode || selectedUserNode.id === "no-nodes") return null;
    return selectedUserNode.id as string;
  }, [selectedUserNode]);
  
  const shouldFetchUserRoles = isRoleSelection && isOpen && !!selectedNodeId;
  const { data: userRolesByNodeResponse, isLoading: isLoadingUserRolesByNode } = useUserRolesByNodeId(
    selectedNodeId,
    shouldFetchUserRoles
  );

  const { mutate: changeUserRole, isPending: isChangingUserRole } = useChangeUserRole();
  const { mutate: changeUserGroup, isPending: isChangingUserGroup } = useChangeUserGroup();

  const userNodeOptions: Option[] = useMemo(() => {
    if (!userNodes || userNodes.length === 0) {
      return [{ id: "no-nodes", fullName: "Yoxdur", role: "" }];
    }
    return userNodes.map((node, index) => ({
      id: node.value || String(index),
      fullName: node.label,
      role: ""
    }));
  }, [userNodes]);

  const prevSourceItemsRef = useRef<SelectionItem[]>([]);
  
  useEffect(() => {
    if (isOpen) {
      if (!isRoleSelection) {
        if (initialSelectedItems.length > 0) setRightList(initialSelectedItems);
        if (sourceItems.length > 0) {
          setLeftList(sourceItems);
          prevSourceItemsRef.current = sourceItems;
        }
      } else {
        setRightList([]);
        setLeftList([]);
      }
      setLeftSelectedIds([]);
      setSearchTerm("");
      setDebouncedSearchTerm("");
      setSelectedUserNode(null);
    } else {
      prevSourceItemsRef.current = [];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isRoleSelection]); 
  
  useEffect(() => {
    if (isOpen && !isRoleSelection && initialSelectedItems.length > 0) {
      const itemsChanged = rightList.length !== initialSelectedItems.length ||
        rightList.some((item, index) => item.name !== initialSelectedItems[index]?.name || item.groupId !== initialSelectedItems[index]?.groupId);
      if (itemsChanged) setRightList(initialSelectedItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSelectedItems, isOpen, isRoleSelection]); 
  
  useEffect(() => {
    if (isOpen && !isRoleSelection && sourceItems.length > 0) {
      const sourceItemsChanged = prevSourceItemsRef.current.length !== sourceItems.length ||
        prevSourceItemsRef.current.some((item, index) => item.name !== sourceItems[index]?.name || item.groupId !== sourceItems[index]?.groupId);
      if (sourceItemsChanged) {
        setLeftList(sourceItems);
        prevSourceItemsRef.current = sourceItems;
      }
    }
  }, [sourceItems, isOpen, isRoleSelection]);

  useEffect(() => {
    if (isRoleSelection && isOpen) {
      if (allRolesData?.pages && Array.isArray(allRolesData.pages) && allRolesData.pages.length > 0) {
        const allRoles: SelectionItem[] = [];
        let idCounter = 1;
        allRolesData.pages.forEach((page) => {
          if (page?.result?.data) {
            page.result.data.forEach((role) => {
              if (role?.name) allRoles.push({ id: idCounter++, name: role.name });
            });
          }
        });
        if (allRoles.length > 0) setLeftList(allRoles);
        else if (!isFetchingAllRoles && !isLoadingAllRoles) setLeftList([]);
      } else if (!isFetchingAllRoles && !isLoadingAllRoles && allRolesData?.pages?.length === 0) {
        setLeftList([]);
      }
    }
  }, [allRolesData, isRoleSelection, isLoadingAllRoles, isFetchingAllRoles, isOpen]);

  useEffect(() => {
    if (isRoleSelection && userRolesByNodeResponse?.result) {
      const selectedRoles: SelectionItem[] = [];
      let idCounter = 1;
      userRolesByNodeResponse.result.forEach((roleName) => {
        if (roleName) selectedRoles.push({ id: idCounter++, name: roleName });
      });
      setRightList(selectedRoles);
      setLeftSelectedIds([]);
    } else if (isRoleSelection && !isLoadingUserRolesByNode && !userRolesByNodeResponse && selectedNodeId) {
      setRightList([]);
    }
  }, [userRolesByNodeResponse, isRoleSelection, isLoadingUserRolesByNode, selectedNodeId]);

  const filteredLeftList = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return leftList;
    return leftList.filter((item) => item.name.toLowerCase().startsWith(term));
  }, [leftList, searchTerm]);

  const handleScroll = useCallback(() => {
    if (!listBoxRef.current || !isRoleSelection) return;
    const { scrollTop, scrollHeight, clientHeight } = listBoxRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, isRoleSelection]);
  
  useEffect(() => {
    const listBox = listBoxRef.current;
    if (listBox && isRoleSelection) {
      listBox.addEventListener('scroll', handleScroll);
      return () => listBox.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll, isRoleSelection]);

  const handleLeftItemClick = (id: number) => {
    setLeftSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const moveRight = () => {
    if (isRoleSelection && (!selectedUserNode || selectedUserNode.id === "no-nodes")) {
      toast.error("Node seçmək lazımdır");
      return;
    }
    const itemsToMove = leftList.filter((item) => leftSelectedIds.includes(item.id));
    const newItems = itemsToMove.filter((item) => !rightList.some((r) => r.name === item.name));
    setRightList([...rightList, ...newItems]);
    setLeftSelectedIds([]);
  };

  const handleDeleteItem = (id: number) => {
    setRightList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    if (isRoleSelection && selectedNodeId) {
      const roleNames = rightList.map((item) => item.name);
      changeUserRole({ nodeId: selectedNodeId, roleNames }, { onSuccess: () => { onSave(rightList); onClose(); } });
    } else if (!isRoleSelection && ldapUserId) {
      const groupIdList = rightList.map(item => item.groupId || sourceItems.find(si => si.name === item.name)?.groupId || '').filter(Boolean);
      changeUserGroup({ userId: ldapUserId, groupIdList }, { onSuccess: () => { onSave(rightList); onClose(); } });
    } else {
      onSave(rightList);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <div className={styles.container}>
        
        {/* SOL TƏRƏF */}
        <div className={styles.listContainer}>
          <div className={styles.controlHeader}>
            <div className={styles.searchWrapper}>
              <MagnifyingGlassIcon width={18} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Axtar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          <div className={styles.listHeader}>
            {isRoleSelection ? "Mövcud Rollar" : "Mövcud Seçimlər"} ({filteredLeftList.length})
          </div>

          <div className={styles.listBox} ref={listBoxRef}>
            {isRoleSelection && (isLoadingAllRoles || isFetchingAllRoles) && filteredLeftList.length === 0 ? (
              <div className={styles.emptyText}>Yüklənir...</div>
            ) : (
              <>
                {filteredLeftList.map((item) => {
                  const isAlreadyAdded = rightList.some((r) => r.name === item.name);
                  const isSelected = leftSelectedIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`${styles.listItem} ${isSelected ? styles.selected : ""}`}
                      style={{ opacity: isAlreadyAdded ? 0.5 : 1 }}
                      onClick={(e) => { e.stopPropagation(); handleLeftItemClick(item.id); }}
                    >
                      <span>{item.name}</span>
                    </div>
                  );
                })}
                {isFetchingNextPage && <div className={styles.emptyText}>Yüklənir...</div>}
                {filteredLeftList.length === 0 && !isLoadingAllRoles && !isFetchingAllRoles && (
                  <div className={styles.emptyText}>{searchTerm.trim() || debouncedSearchTerm ? "Nəticə tapılmadı" : "Məlumat yoxdur"}</div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ORTA - ACTIONS */}
        <div className={styles.actions}>
          <button
            className={styles.transferBtn}
            onClick={(e) => { e.stopPropagation(); moveRight(); }}
            disabled={leftSelectedIds.length === 0}
            title="Seçilənləri əlavə et"
          >
            <ChevronRightIcon width={20} />
          </button>
        </div>

        {/* SAĞ TƏRƏF */}
        <div className={styles.listContainer}>
          <div className={styles.controlHeader}>
            {isRoleSelection ? (
              <div style={{ width: '100%' }}>
                {/* Variant 'compact' olaraq dəyişdirildi */}
                <CustomSelect 
                  options={userNodeOptions}
                  value={selectedUserNode} 
                  onChange={(val) => {
                    const nodeChanged = selectedUserNode?.id !== val?.id;
                    setSelectedUserNode(val);
                    if (nodeChanged) { setRightList([]); setLeftSelectedIds([]); }
                  }} 
                  defaultText="Node seçin"
                  variant="compact" 
                  className={styles.nodeSelect}
                  isClearable={false}
                  disabled={userNodeOptions.length === 1 && userNodeOptions[0]?.fullName === "Yoxdur"}
                />
              </div>
            ) : (
              <div style={{ width: '100%', height: '32px' }}></div> 
            )}
          </div>

          <div className={styles.listHeader}>Seçilmişlər ({rightList.length})</div>

          <div className={styles.listBox}>
            {isRoleSelection && isLoadingUserRolesByNode ? (
              <div className={styles.emptyText}>Yüklənir...</div>
            ) : (
              <>
                {rightList.map((item) => (
                  <div key={item.id} className={styles.listItem} style={{ cursor: "default" }}>
                    <span>{item.name}</span>
                    <button
                      className={styles.deleteBtn}
                      onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }}
                      title="Siyahıdan çıxar"
                    >
                      <TrashIcon width={18} />
                    </button>
                  </div>
                ))}
                {rightList.length === 0 && !isLoadingUserRolesByNode && <div className={styles.emptyText}>Seçim edilməyib</div>}
              </>
            )}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <Button type="button" variant="secondary" onClick={onClose} disabled={isChangingUserRole || isChangingUserGroup}>Ləğv et</Button>
        <Button type="button" variant="primary" onClick={handleSave} disabled={isChangingUserRole || isChangingUserGroup}>
          {(isChangingUserRole || isChangingUserGroup) ? "Yüklənir..." : "Yadda saxla"}
        </Button>
      </div>
    </Modal>
  );
};

export default GroupSelectionModal;