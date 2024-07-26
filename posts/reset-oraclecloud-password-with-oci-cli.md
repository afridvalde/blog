---
date: 2024-07-25
title: 利用oci-cli重置Oracle Cloud用户密码
category: Oracle Cloud
tags:
- Oracle Clou
description: 
---

# 利用oci-cli重置Oracle Cloud用户密码

> 阅读前请先确保你之前添加并存下了Api配置文件

## 一、安装oci-cli

安装教程：https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/cliinstall.htm

我的机子是debian 12，所以使用如下命令安装

```bash
bash -c "$(curl -L https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.sh)"
```

安装过程中一路默认或者按y就行了（也可以根据需要自行修改）

安装完成后需要执行 `source .bashrc` 刷新一下环境变量

执行一下 `oci --version` 测试是否安装成功

```bash
[~]$ oci --version    
3.44.4
```

## 二、配置Api

输入 `oci setup config` 命令初始化配置文件

在 `Enter a location for your config [/root/.oci/config]: ` 回车创建完文件夹后 `Ctrl + c` 结束命令

在 `/root/.oci/config` 下新建文件 `config` 并写入你的Api配置，同时将你的Api私钥上传到该文件夹

配置内容类似如下

```ini
[DEFAULT]
user=ocid1.user.oc1..xxx
fingerprint=6b:9a:07:c8:d2:fa:88:44:56:a9:44:e2:e7:c3:5a:e5
tenancy=ocid1.tenancy.oc1..xxx
region=eu-frankfurt-1
key_file=/root/.oci/main.pem
```

执行 `oci iam availability-domain list` 命令测试配置是否成功

```bash
[~]$ oci iam availability-domain list
WARNING: Permissions on /root/.oci/config are too open. 
To fix this please try executing the following command: 
oci setup repair-file-permissions --file /root/.oci/config 
Alternatively to hide this warning, you may set the environment variable, OCI_CLI_SUPPRESS_FILE_PERMISSIONS_WARNING: 
export OCI_CLI_SUPPRESS_FILE_PERMISSIONS_WARNING=True

WARNING: Permissions on /root/.oci/config are too open. 
To fix this please try executing the following command: 
oci setup repair-file-permissions --file /root/.oci/config 
Alternatively to hide this warning, you may set the environment variable, OCI_CLI_SUPPRESS_FILE_PERMISSIONS_WARNING: 
export OCI_CLI_SUPPRESS_FILE_PERMISSIONS_WARNING=True

WARNING: Permissions on /root/.oci/main.pem are too open. 
To fix this please try executing the following command: 
oci setup repair-file-permissions --file /root/.oci/main.pem 
Alternatively to hide this warning, you may set the environment variable, OCI_CLI_SUPPRESS_FILE_PERMISSIONS_WARNING: 
export OCI_CLI_SUPPRESS_FILE_PERMISSIONS_WARNING=True

{
  "data": [
    {
      "compartment-id": "ocid1.tenancy.oc1..xxx",
      "id": "ocid1.availabilitydomain.oc1..xxx",
      "name": "xxx:EU-FRANKFURT-1-AD-1"
    },
    {
      "compartment-id": "ocid1.tenancy.oc1..xxx",
      "id": "ocid1.availabilitydomain.oc1..xxx",
      "name": "xxx:EU-FRANKFURT-1-AD-2"
    },
    {
      "compartment-id": "ocid1.tenancy.oc1..xxx",
      "id": "ocid1.availabilitydomain.oc1..xxx",
      "name": "xxx:EU-FRANKFURT-1-AD-3"
    }
  ]
}
```

这里会警告我们 `config` 和`main.pem` 权限过于开放，按提示输入以下命令修复（也可以忽略）

```bash
oci setup repair-file-permissions --file /root/.oci/config
oci setup repair-file-permissions --file /root/.oci/main.pem
```

再次执行 `oci iam availability-domain list`，警告消失

## 三、重置用户密码

执行 `oci iam availability-domain list --query 'data[0]."compartment-id"' --raw-output` 命令获取 `compartment-id`

```bash
[~]$ oci iam availability-domain list --query 'data[0]."compartment-id"' --raw-output
ocid1.tenancy.oc1..xxx
```

记录下 `ocid1.tenancy.oc1..xxx`

---

执行 `oci iam user list --query 'data[*].{name:name, id:id}' --output table --compartment-id ocid1.tenancy.oc1..xxx` 获取用户列表

```bash
[~]$ oci iam user list --query 'data[*].{name:name, id:id}' --output table --compartment-id ocid1.tenancy.oc1..xxx
+---------------------+-------------+
| id                  | name        |
+-----------------------------------+
| ocid1.user.oc1..xxx | xxx@xxx.xxx |
+---------------------+-------------+
```

从table中找到需要重置密码的 `name`，记录下对应的 `id`

---

执行 `oci iam user ui-password create-or-reset --user-id ocid1.user.oc1..xxx` 重置密码，命令会给用户生成一个临时密码，使用该密码进行登录

```bash
[~]$ oci iam user ui-password create-or-reset --user-id ocid1.user.oc1..xxx
{
  "data": {
    "inactive-status": null,
    "lifecycle-state": "ACTIVE",
    "password": "aqK5H9Yhn1jo",
    "time-created": "2024-07-24T07:37:20.687000+00:00",
    "user-id": "ocid1.user.oc1..xxx"
  },
  "etag": "3c8f0e5b2ssd23d5aa273351c3"
}
```

如果出现如下输出，则需要新建用户登录

```bash
[~]$ oci iam user ui-password create-or-reset --user-id ocid1.user.oc1..xxx
ServiceError:
{
    "client_version": "Oracle-PythonSDK/2.129.4, Oracle-PythonCLI/3.44.4",
    "code": "NotAuthorizedOrNotFound",
    "logging_tips": "Please run the OCI CLI command using --debug flag to find more debug information.",
    "message": "PATCH request failed",
    "opc-request-id": "15B47A12ED444442BB9C8A97E70E45BC/C0C3BF6DDD7319C90D0E12423D6E0EF3/72E04671C91BC8CA5E34118B9FBB769C",
    "operation_name": "create_or_reset_ui_password",
    "request_endpoint": "POST https://identity.eu-frankfurt-1.oci.oraclecloud.com/20160918/users/ocid1.user.oc1..xxx/uiPassword",
    "status": 404,
    "target_service": "identity",
    "timestamp": "2024-07-24T08:29:24.836640+00:00",
    "troubleshooting_tips": "See [https://docs.oracle.com/iaas/Content/API/References/apierrors.htm] for more information about resolving this error. If you are unable to resolve this issue, run this CLI command with --debug option and contact Oracle support and provide them the full error message."
}
```

## 四、新建用户登录

执行如下命令新建用户

```bash
oci iam user create \
  --name Admin \
  --description Admin \
  --compartment-id ocid1.tenancy.oc1..xxx \
  --email admin@xxx.xxx \
  --query 'data.id' \
  --raw-output
```

正确输出如下

```bash
[~]$ oci iam user create \
  --name Admin \
  --description Admin \
  --compartment-id ocid1.tenancy.oc1..xxx \
  --email admin@xxx.xxx \
  --query 'data.id' \
  --raw-output
ocid1.user.oc1..xxx
```

---

执行如下命令查看组列表

```bash
oci iam group list \
  --query 'data[*].{group_id:id, group_name:name}' \
  --output table \
  --compartment-id ocid1.tenancy.oc1..xxx
```

输出如下

```bash
[~]$ oci iam group list --query 'data[*].{group_id:id, group_name:name}' --output table --compartment-id ocid1.tenancy.oc1..xxx
+----------------------+------------------+
| group_id             | group_name       |
+----------------------+------------------+
| ocid1.group.oc1..xxx | Administrators   |
| ocid1.group.oc1..xxx | All Domain Users |
+----------------------+------------------+
```

记录下 `Administrators` 对应的 `group_id`

---

执行如下命令将新增的用户加入到 `Administrators` 组中

```bash
oci iam group add-user \
  --group-id ocid1.group.oc1..xxx \
  --user-id ocid1.user.oc1..xxx
```

输出如下

```bash
[~]$ oci iam group add-user \
  --group-id ocid1.group.oc1..xxx \
  --user-id ocid1.user.oc1..xxx
{
  "data": {
    "compartment-id": "ocid1.tenancy.oc1..xxx",
    "group-id": "ocid1.group.oc1..xxx",
    "id": "ocid1.groupmembership.oc1..xxx",
    "inactive-status": null,
    "lifecycle-state": "ACTIVE",
    "time-created": "2024-07-24T08:47:17.670000+00:00",
    "user-id": "ocid1.user.oc1..xxx"
  }
}
```

---

等待一会，一封激活邮件就会发送到 `admin@xxx.xxx`，按邮件提示激活登录即可

![active.webp](https://ah7ki.loli.ae/2024/07/24/236da0d17739d268aa9b0419d136cd93.webp)