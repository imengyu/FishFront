export default {

    //Settings

    defaultSettings: {
        SiteTitle: 'ALONE SPACE',
        FooterText: '<i class="fa fa-copyright" aria-hidden="true"></i> 2019 Dreamfish',
        HeaderMenu: [
            {
              name: "主页",
              link: "/"
            },
            {
              name: "文章",
              link: "/archives/"
            },
            {
              name: "归档",
              link: "/archives/month/"
            },
            {
              name: "关于",
              link: "/archives/post/about/"
            }
        ],   
        AnonymousComment: true,
        AllowRegister: true,
        CollectVisitorStat: true,
        CollectVisitorStatExclude: [
            '/admin/',
            '/user/',
            '/sign-in/',
            '/sign-out/',
        ],    
    },
   
    //Const values

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
    PostPrefixName: {
        none: '(不设置)',
        original: '原创',
        reprint: '转载',
        album: '相册',
        video: '视频'
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