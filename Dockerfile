# 使用官方Nginx镜像作为基础镜像
FROM nginx:alpine

# 删除默认的Nginx配置文件
RUN rm /etc/nginx/conf.d/default.conf

# 复制自定义的Nginx配置文件到容器中
COPY nginx/nginx.conf /etc/nginx/conf.d/

# 复制构建好的Vue应用到Nginx的html目录下
COPY dist/ /usr/share/nginx/html

# 暴露80端口
EXPOSE 80

# 启动Nginx服务
CMD ["nginx", "-g", "daemon off;"]