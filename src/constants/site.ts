export const site = {
  name: "yondako",
  description: {
    short: "“よんだこと”をわすれない",
    long: "yondakoは、よんだことをわすれないための読書記録サービスです。",
  },
  url: "https://yondako.com",
  infoUrl: "https://info.yondako.com",
  github: "https://github.com/yondako/yondako",
};

export const links = [
  {
    title: "データソース",
    href: new URL("/docs/data-source", site.infoUrl).toString(),
  },
  {
    title: "GitHub",
    href: site.github,
  },
  {
    title: "利用規約",
    href: new URL("/docs/terms", site.infoUrl).toString(),
  },
  {
    title: "プライバシーポリシー",
    href: new URL("/docs/privacy", site.infoUrl).toString(),
  },
] as const;
