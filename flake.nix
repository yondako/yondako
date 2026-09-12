{
  description = "yondako dev shell";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs =
    { nixpkgs, ... }:
    let
      forAllSystems = nixpkgs.lib.genAttrs [
        "x86_64-linux"
        "aarch64-linux"
        "aarch64-darwin"
      ];
    in
    {
      devShells = forAllSystems (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default = pkgs.mkShell {
            packages = [
              pkgs.nodejs
              pkgs.bun
              pkgs.mkcert
              # mkcert がブラウザの NSS 信頼ストアへ CA を登録するために必要。
              pkgs.nssTools
              pkgs.fzf
            ];

            # NixOS でも workerd の外部 API 通信が CA バンドルを参照できるようにする。
            # setup hook の SSL_CERT_FILE は nix develop で除外されるため、ここで設定する。
            shellHook = ''
              export SSL_CERT_FILE=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt
              export NIX_SSL_CERT_FILE=$SSL_CERT_FILE
              export NODE_EXTRA_CA_CERTS=$SSL_CERT_FILE
            '';
          };
        }
      );
    };
}
