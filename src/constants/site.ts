export const site = {
  name: "yondako",
  description: {
    short: "“よんだこと”をわすれない",
    long: "yondakoは、よんだことをわすれないための読書記録サービスです。",
  },
  url: "https://yondako.com",
  infoUrl: "https://info.yondako.com",
  github: "https://github.com/yondako/yondako",
  xUrl: "https://x.com/yondako_com",
};

export const links = {
  github: {
    title: "GitHub",
    href: site.github,
  },
  terms: {
    title: "利用規約",
    href: new URL("/docs/terms", site.infoUrl).toString(),
  },
  privacy: {
    title: "プライバシーポリシー",
    href: new URL("/docs/privacy", site.infoUrl).toString(),
  },
  dataSource: {
    title: "データの取得元について",
    href: new URL("/docs/data-source", site.infoUrl).toString(),
  },
} as const;
