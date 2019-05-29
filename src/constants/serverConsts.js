export default {
    UserLevels: {
        baned: 0,
        admin: 1,
        writer: 2,
        guest: 3
    },
    UserPrivileges: {
        manageAllArchives: 0x1,
        manageClassAndTags: 0x2,
        manageMediaCenter: 0x4,
        manageUsers: 0x8,
        gaintPrivilege: 0x10,
        globalSettings: 0x20,
    },
    ArchiveStatus: {
        PUBLISH: 1,
        PRIVATE: 0,
        DRAFT: 2,
    },
}