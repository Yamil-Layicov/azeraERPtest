import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import { CustomSelect, MessageModal, NotificationPanel } from "@/shared/ui";
import { useTheme } from "@/shared/lib/hooks";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useUser } from "@/features/auth/hooks/useUser";
import { useRefreshPerInfo } from "@/features/auth/hooks/useRefreshPerInfo";
import { useChangeUserNode } from "@/features/auth/hooks/useChangeUserNode";
import {
  Bars3Icon,
  BellIcon,
  EnvelopeIcon,
  ArrowRightStartOnRectangleIcon,
  ArrowPathIcon,
  SunIcon,
  MoonIcon,
  UserIcon,
  EllipsisVerticalIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import { ROUTES } from "@/app/routes/consts";
import type { NavbarProps, Option } from "@/shared/types";

function Navbar({ onToggleSidebar }: NavbarProps) {
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMessageModalOpen, setMessageModalOpen] = useState(false);
  const [isNotificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const { theme, toggleTheme } = useTheme();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { mutate: refreshPerInfo, isPending: isRefreshingPerInfo } =
    useRefreshPerInfo();
  const { mutate: changeUserNode, isPending: isChangingNode } =
    useChangeUserNode();

  const { data: meData } = useUser();
  const user = meData?.result?.user;

  const userSelectOptions: Option[] = useMemo(() => {
    const nodes = meData?.result?.nodes ?? [];

    if (nodes.length === 0) {
      return [
        {
          id: "empty-node",
          fullName: "seçim yoxdur",
          role: "",
        },
      ];
    }

    return nodes.map((node) => ({
      id: node.value,
      fullName: node.label,
      role: "",
    }));
  }, [meData?.result?.nodes]);

  const [selectedNode, setSelectedNode] = useState<Option | null>(null);

  useEffect(() => {
    if (userSelectOptions.length === 0) return;

    const matchedNode =
      userSelectOptions.find((option) => option.id === user?.nodeId) ||
      userSelectOptions[0];

    setSelectedNode(matchedNode ?? null);
  }, [userSelectOptions, user?.nodeId]);

  const currentUser = {
    fullName:
      user?.fullname ||
      (selectedNode && selectedNode.id !== "empty-node"
        ? selectedNode.fullName
        : user?.username) ||
      "",

    role: selectedNode?.role || user?.roles?.[0] || "",
  };

  const messages = [
    {
      id: 1,
      title: "Yeni tapşırığınız var",
      content: "Azera Holding saytında yeni tapşırıq var.",
      timestamp: "2 saat əvvəl",
      isRead: false,
    },
  ];

  const notifications = [
    {
      id: 1,
      title: "Sistem",
      message: "Sistem uğurla yeniləndi.",
      timestamp: "5 dəqiqə əvvəl",
      isRead: false,
      type: "success" as const,
    },
  ];

  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;
  const unreadNotificationsCount = notifications.filter(
    (n) => !n.isRead,
  ).length;

  const handleLogout = () => {
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    logout();
  };

  const handleNodeChange = (option: Option | null) => {
    if (!option) return;

    const nodeId = String(option.id);
    if (nodeId === "empty-node") return;

    // Eğer seçilen node mevcut node ile aynıysa işlem yapma
    if (nodeId === user?.nodeId) return;

    setSelectedNode(option);
    changeUserNode(nodeId);
  };

  useEffect(() => {
    function handleClickOutside(event: globalThis.MouseEvent) {
      if (
        profileMenuRef.current &&
        event.target instanceof Node &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
      if (mobileMenuRef.current && event.target instanceof Node) {
        const target = event.target as HTMLElement;
        const isInCustomSelect = target.closest('[role="listbox"]') !== null;
        const isInMobileMenu = mobileMenuRef.current.contains(target);

        if (!isInMobileMenu && !isInCustomSelect) {
          setMobileMenuOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className={styles.navWrapper}>
      <div className={styles.leftSection}>
        <button onClick={onToggleSidebar} className={styles.toggleButton}>
          <Bars3Icon className={styles.icon} />
        </button>
        <Link to={ROUTES.DASHBOARD.LINK}>
          <img
            src={
              theme === "light"
                ? `${import.meta.env.BASE_URL}images/logo/light-mode-logo.png`
                : `${import.meta.env.BASE_URL}images/logo/dark-mode-logo.png`
            }
            alt="Logo"
            className={styles.logoImage}
            style={{ cursor: "pointer", height: "54px", width: "auto" }}
          />
        </Link>
      </div>

      <div className={styles.rightSection}>
        <button
          className={`${styles.iconButton} ${styles.hideOnMobile}`}
          onClick={() => setMessageModalOpen(true)}
        >
          <EnvelopeIcon className={styles.icon} />
          {unreadMessagesCount > 0 && (
            <span className={styles.badge}>{unreadMessagesCount}</span>
          )}
        </button>

        <CustomSelect
          options={userSelectOptions}
          value={selectedNode}
          onChange={handleNodeChange}
          defaultText="----------"
          variant="navbar"
          className={styles.hideOnMobile + " " + styles.panelName}
          isClearable={false}
          disabled={
            (userSelectOptions.length === 1 &&
              userSelectOptions[0]?.id === "empty-node") ||
            isChangingNode
          }
        />

        <div
          className={`${styles.profileContainer} ${styles.hideOnMobile}`}
          onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
          ref={profileMenuRef}
        >
          <div className={styles.profileAvatar}>
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                className={styles.profileAvatarImage}
              />
            ) : (
              <UserIcon className={styles.profileAvatarIcon} />
            )}
          </div>
          <p className={styles.profileName} title={currentUser.fullName}>
            {currentUser.fullName}
          </p>

          {isProfileMenuOpen && (
            <div className={styles.profileDropdown}>
              <div className={styles.profileDropdownHeader}>
                <p className={styles.profileDropdownName}>
                  {currentUser.fullName}
                </p>
              </div>
              <div className={styles.profileDropdownDivider}></div>
              <button
                className={styles.dropdownItem}
                onClick={() => {
                  refreshPerInfo();
                  setProfileMenuOpen(false);
                }}
                disabled={isRefreshingPerInfo}
              >
                <ArrowsUpDownIcon className={styles.dropdownIcon} />
                <span>
                  {isRefreshingPerInfo ? "Yenilənir..." : "Məlumatları yenilə"}
                </span>
              </button>
              <Link
                to={ROUTES.PROFILE.SETTINGS.LINK}
                className={styles.dropdownItem}
                onClick={() => setProfileMenuOpen(false)}
              >
                <UserIcon className={styles.dropdownIcon} />
                <span>Profil</span>
              </Link>
              <Link
                to="#"
                className={styles.dropdownItem}
                onClick={handleLogout}
              >
                <ArrowRightStartOnRectangleIcon
                  className={styles.dropdownIcon}
                />
                <span>{isLoggingOut ? "Çıxış edilir..." : "Çıxış et"}</span>
              </Link>
            </div>
          )}
        </div>

        <button
          className={`${styles.iconButton} ${styles.hideOnMobile}`}
          onClick={toggleTheme}
        >
          {theme === "light" ? (
            <MoonIcon className={styles.icon} />
          ) : (
            <SunIcon className={styles.icon} />
          )}
        </button>

        <button
          className={styles.iconButton}
          onClick={() => setNotificationPanelOpen(true)}
        >
          <BellIcon className={styles.icon} />
          {unreadNotificationsCount > 0 && (
            <span className={styles.badge}>{unreadNotificationsCount}</span>
          )}
        </button>

        <div className={styles.mobileMenuContainer} ref={mobileMenuRef}>
          <button
            className={`${styles.iconButton} ${styles.showOnMobile}`}
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            <EllipsisVerticalIcon className={styles.icon} />
          </button>

          {isMobileMenuOpen && (
            <div
              className={styles.mobileMenuDropdown}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.mobileMenuItem}>
                <CustomSelect
                  options={userSelectOptions}
                  value={selectedNode}
                  onChange={handleNodeChange}
                  defaultText="------------"
                  variant="navbar"
                  disabled={
                    (userSelectOptions.length === 1 &&
                      userSelectOptions[0]?.id === "empty-node") ||
                    isChangingNode
                  }
                />
              </div>

              <button
                className={styles.mobileMenuItem}
                onClick={() => {
                  setMessageModalOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                <EnvelopeIcon className={styles.dropdownIcon} />
                <span>Mesajlar</span>
                {unreadMessagesCount > 0 && (
                  <span className={styles.mobileBadge}>
                    {unreadMessagesCount}
                  </span>
                )}
              </button>

              <button className={styles.mobileMenuItem} onClick={toggleTheme}>
                {theme === "light" ? (
                  <MoonIcon className={styles.dropdownIcon} />
                ) : (
                  <SunIcon className={styles.dropdownIcon} />
                )}
                <span>
                  {theme === "light" ? "Qaranlıq rejim" : "İşıqlı rejim"}
                </span>
              </button>

              <div className={styles.mobileMenuDivider}></div>

              <div className={styles.mobileProfileInfo}>
                <div className={styles.profileAvatar}>
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="A"
                      className={styles.profileAvatarImage}
                    />
                  ) : (
                    <UserIcon className={styles.profileAvatarIcon} />
                  )}
                </div>
                <div>
                  <p className={styles.mobileProfileName}>
                    {currentUser.fullName}
                  </p>
                </div>
              </div>

              <button
                className={styles.mobileMenuItem}
                onClick={() => {
                  refreshPerInfo();
                  setMobileMenuOpen(false);
                }}
                disabled={isRefreshingPerInfo}
              >
                <ArrowPathIcon className={styles.dropdownIcon} />
                <span>
                  {isRefreshingPerInfo ? "Yenilənir..." : "Məlumatları yenilə"}
                </span>
              </button>

              <Link
                to={ROUTES.PROFILE.SETTINGS.LINK}
                className={styles.mobileMenuItem}
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserIcon className={styles.dropdownIcon} />
                <span>Profil</span>
              </Link>

              <Link
                to="#"
                className={styles.mobileMenuItem}
                onClick={handleLogout}
              >
                <ArrowRightStartOnRectangleIcon
                  className={styles.dropdownIcon}
                />
                <span>{isLoggingOut ? "Çıxış edilir..." : "Çıxış et"}</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        messages={messages}
      />
      <NotificationPanel
        isOpen={isNotificationPanelOpen}
        onClose={() => setNotificationPanelOpen(false)}
        notifications={notifications}
      />
    </nav>
  );
}

export default Navbar;
