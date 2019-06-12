export default {
    SiteTitle: 'ALONE SPACE',
    AnonymousComment: true,
    PartPositions: {
        viewPost: '/archives/post/',
        viewClass: '/archives/categories/',
        viewDate: '/archives/month/',
        viewTag: '/archives/tags/',
        editArchive: '/admin/write-archive/',
    },
    PostPrefix: {
        none: 0,
        original: 1,
        reprint: 2,
        album: 3,
        video: 4
    },
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
    UserPrivilegesName: {
        manageAllArchives: '管理所有用户的文章',
        manageClassAndTags: '管理分类和标签',
        manageMediaCenter: '管理全局媒体库',
        manageUsers: '管理其他用户',
        gaintPrivilege: '可分配权限给其他用户',
        globalSettings: '修改全局设置',
    },
    ArchiveStatus: {
        PUBLISH: 1,
        PRIVATE: 0,
        DRAFT: 2,
    },
}