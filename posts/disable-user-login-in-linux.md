---
date: 2024-06-08
title: 在Linux中禁止某个用户登录
category: Linux
tags:
  - Linux
description: 在 Linux 中，我们可以通过修改 /etc/passwd 文件来禁止特定用户（例如 opc 用户）登录。
---

# 在Linux中禁止某个用户登录

在 Linux 中，我们可以通过修改 `/etc/passwd` 文件来禁止特定用户（例如 `opc` 用户）登录。我们需要将用户的 shell 改为 `/sbin/nologin` 或 `/bin/false`。这可以通过使用 `usermod` 命令来完成。

以下是具体的命令：

```bash
sudo usermod -s /sbin/nologin opc
```

或者

```bash
sudo usermod -s /bin/false opc
```

这两个命令都会禁止 `opc` 用户登录。`/sbin/nologin` 会显示一条消息然后结束，而 `/bin/false` 什么也不做。