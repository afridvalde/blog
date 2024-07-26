---
date: 2024-07-26
title: Debian下搭建Tuic服务
category: Linux
tags:
- Linux
description: 
---
# Debian下搭建Tuic服务

安装依赖

```bash
apt update -y && apt install wget -y
```

建立 `tuic` 文件夹

```bash
mkdir /opt/tuic && cd /opt/tuic
```

下载服务器端程序

```bash
wget -O tuic-server https://github.com/EAimTY/tuic/releases/download/tuic-server-1.0.0/tuic-server-1.0.0-x86_64-unknown-linux-gnu
```

赋权

```bash
chmod +x tuic-server
```

创建配置文件

```bash
touch config.json
```

将下面的配置文件写入 `config.json`

```json
{
    "server": "[::]:443",
    "users": {
        "aab2d47c-c9f2-427d-8ed6-53273982bd90": "xyz123"
    },
    "certificate": "/opt/tuic/cert.pem",
    "private_key": "/opt/tuic/key.pem",
    "congestion_control": "bbr",
    "alpn": ["h3"]
}
```

创建 `systemctl配置文件`

```bash
touch /lib/systemd/system/tuic.service
```

将下面的配置写入 `tuic.service`

```ini
[Unit]
Description=Delicately-TUICed 0-RTT proxy protocol
Documentation=https://github.com/EAimTY/tuic
After=network.target nss-lookup.target

[Service]
User=root
WorkingDirectory=/opt/tuic
CapabilityBoundingSet=CAP_NET_ADMIN CAP_NET_BIND_SERVICE
AmbientCapabilities=CAP_NET_ADMIN CAP_NET_BIND_SERVICE
ExecStart=/opt/tuic/tuic-server -c config.json
Restart=on-failure
RestartSec=10
LimitNPROC=512
LimitNOFILE=infinity

[Install]
WantedBy=multi-user.target
```

创建自签证书

```bash
openssl genrsa -out /opt/tuic/key.pem 2048
openssl req -new -out /opt/tuic/req.csr -key /opt/tuic/key.pem
openssl x509 -req -in /opt/tuic/req.csr -out /opt/tuic/cert.pem -signkey /opt/tuic/key.pem -days 3650
```

启动 `tuic服务`

```bash
systemctl enable --now tuic.service
```

`clash` 配置示例

```yaml
- name: proxie-name
  type: tuic
  server: your.ip
  port: 443
  uuid: aab2d47c-c9f2-427d-8ed6-53273982bd90
  password: xyz123
  alpn:
    - h3
  skip-cert-verify: true
  congestion-controller: bbr
  reduce-rtt: true
  request-timeout: 8000
  udp-relay-mode: native
```

