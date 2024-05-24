---
date: 2021-06-30
title: 为Oracle Cloud添加Keycloak登录
category: Oracle Cloud
tags:
- Oracle Cloud
description: 
---

# 为Oracle Cloud添加Keycloak登录

## 步骤1：在Keycloak添加新领域

![](https://ah7ki.loli.ae/2024/05/24/1974a26b4f8a1c0e63294613d30548f1.webp)

## 步骤2：下载领域SAML元数据

![](https://ah7ki.loli.ae/2024/05/24/35ec5c6fcee839d05447a0570127e304.webp)

## 步骤3：为用户添加中间名属性

如果使用email进行匹配可跳过，在 `Realm Settings -> User profile -> JSON editor` 中 `lastname` 前添加一个 `middleName` 属性

```json
{
  "name": "middleName",
  "displayName": "Middle name",
  "validations": {
    "length": {
      "max": 255
    },
    "person-name-prohibited-characters": {}
  },
  "required": {
    "roles": [
      "user"
    ]
  },
  "permissions": {
    "view": [
      "admin",
      "user"
    ],
    "edit": [
      "admin",
      "user"
    ]
  },
  "multivalued": false
},
```

![](https://ah7ki.loli.ae/2024/05/24/6173be3bd41b70f51dbe2977a8f2e01e.webp)

## 步骤4：修改个人资料

点击 `My profile -> Edit my profile` 修改 `Middle name` 为想要值

![](https://ah7ki.loli.ae/2024/05/24/b99b372f198d921598c03f042fe9ee0b.webp)

## 步骤5：下载Oracle SAML元数据

在 `Identity domain: Default -> Security -> Identity providers` 页面中点击 `Export SAML metadata` ，下载 `Metadata file`

![](https://ah7ki.loli.ae/2024/05/24/5a47d37cda37e9230706baf6604bb31a.webp)

## 步骤6：创建客户端

在Keycloak `Clients` 页面中选择 `Import client` ，点击 `Browse` 选择刚刚导出的Oracle SAML 元数据，`Name` 选填

![](https://ah7ki.loli.ae/2024/05/24/ed4647718338edfccaefa3b682155970.webp)

**步骤7：创建映射关系**

![](https://ah7ki.loli.ae/2024/05/24/bc1f54392b7c7aafa4a4c15b84d84f42.webp)

![](https://ah7ki.loli.ae/2024/05/24/d5e63a0dd3d5bf9cf5de54e6bdf3833b.webp)

![](https://ah7ki.loli.ae/2024/05/24/d262c287cf8e88313a9cbffd98fb7876.webp)

## 步骤7：创建用户

其中Middle name需要与 **步骤4：修改个人资料** 中的用户Middle name相同

![](https://ah7ki.loli.ae/2024/05/24/fe89a6dcacbb3b79d9d97ab9f35d8e09.webp)

自行在 `Credentials` 中设置密码

## 步骤8：添加身份提供商

前往Oracle Cloud 中的 `Identity providers` 页面 (**步骤5：下载Oracle SAML元数据**) ，点击 `Add SAML IdP`

![](https://ah7ki.loli.ae/2024/05/24/74237df0ef2badd6ff589e707d5fabaf.webp)

输入名称

![](https://ah7ki.loli.ae/2024/05/24/0f1ff1644077a7e040cceb16edaa706e.webp)

导入 **步骤2：下载领域SAML元数据** 中下载的元数据

![](https://ah7ki.loli.ae/2024/05/24/8fbaa7497148f9fc4c8fe1b4e1353be2.webp)

设置映射关系

![](https://ah7ki.loli.ae/2024/05/24/c9a674934b2eb264a8f6e481da84c2c4.webp)

点击 `Create IdP` ，出现如下界面

![](https://ah7ki.loli.ae/2024/05/24/de470067d7fe3de4f0471726713620ca.webp)

点击 `Test login` 测试登录

![](https://ah7ki.loli.ae/2024/05/24/8ff3685ceb2e56b29f6cbdfb5519f538.webp)

出现如下界面测试通过

![](https://ah7ki.loli.ae/2024/05/24/9875d8c260bbfd15e36d44bf0685ea71.webp)

## 步骤9：激活IdP

回到 `Add SAML identity provider` 页面，点击 `Activate` ，激活后点击 `Add to IdP policy ` 跳转到如下界面，点击 `Default Identity Provider Policy` 

![](https://ah7ki.loli.ae/2024/05/24/a132d9ba8afb68df93aebc97085146d5.webp)

点击 `Edit IdP rule`

![](https://ah7ki.loli.ae/2024/05/24/2dc3ef24cf7e0fdd1bc008e9f6a00c23.webp)

将设置的身份提供商加入到 `Assign identity providers`

![](https://ah7ki.loli.ae/2024/05/24/a023cd4555cf54deb281fc8185b3dc7d.webp)

## 可选：为Keycloak登录跳过MFA

在 `Security` 下的 `Sign-on policies` 页面中点击 `Security Policy for OCI Console`

![](https://ah7ki.loli.ae/2024/05/24/ccbc065c53c212ca237b5530c7e8540d.webp)

点击 `Add sign-on rule` ，在 `Authenticating identity provider` 选择设置的身份提供商，并勾选上 `Administrator` 选项，保存

![](https://ah7ki.loli.ae/2024/05/24/503ab373ebdf248cf28d2d4f5fd341e8.webp)

点击 `Edit priority` 将设置的规则置顶

![](https://ah7ki.loli.ae/2024/05/24/af82ca0549800dfcbf916166e5781d42.webp)

不关闭当前页面，令开一个浏览器测试登录效果

![](https://ah7ki.loli.ae/2024/05/24/63312db0d6d89583645e78f3f6e863ae.webp)

![](https://ah7ki.loli.ae/2024/05/24/f3635966e8561a570f4de83869f3e69e.webp)

![](https://ah7ki.loli.ae/2024/05/24/bf082ca81e8aede6382407e5b2cbcb53.webp)