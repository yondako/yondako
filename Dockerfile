FROM node:latest

# 結局nodeベースのイメージに入れるのが楽だった...
RUN npm i -g bun
RUN bun i -g wrangler@d1

CMD ["bash"]