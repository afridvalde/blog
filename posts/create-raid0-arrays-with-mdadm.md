---
date: 2024-07-25
title: 使用mdadm配置Raid 0
category: Linux
tags:
- Linux
description: 
---

# 使用mdadm配置Raid 0

安装mdadm

```bash
apt-get update && apt-get install mdadm -y
```

删除存储设备上的现有分区，并创建一个新分区

```bash
[~] fdisk /dev/sdb

Welcome to fdisk (util-linux 2.38.1).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.

The backup GPT table is not on the end of the device. This problem will be corrected by write.

Command (m for help): d
Partition number (1,14,15, default 15): 

Partition 15 has been deleted.

Command (m for help): d
Partition number (1,14, default 14): 

Partition 14 has been deleted.

Command (m for help): d
Selected partition 1
Partition 1 has been deleted.

Command (m for help): n
Partition number (1-128, default 1): 
First sector (34-97677278, default 2048): 
Last sector, +/-sectors or +/-size{K,M,G,T,P} (2048-97677278, default 97675263): 

Created a new partition 1 of type 'Linux filesystem' and of size 46.6 GiB.

Command (m for help): w
The partition table has been altered.
Calling ioctl() to re-read partition table.
Syncing disks.

[~] fdisk /dev/sdc
...
```

使用 `lsblk -o NAME,SIZE,FSTYPE,TYPE,MOUNTPOINT` 列出所有可用设备

```bash
[~] lsblk -o NAME,SIZE,FSTYPE,TYPE,MOUNTPOINT
NAME     SIZE FSTYPE TYPE MOUNTPOINT
sda      100G        disk 
├─sda1   512M vfat   part /boot/efi
├─sda2  98.5G ext4   part /
└─sda3   976M swap   part [SWAP]
sdb     46.6G        disk 
└─sdb1  46.6G        part 
sdc     46.6G        disk 
└─sdc1  46.6G        part 
sdd     46.6G        disk 
└─sdd1  46.6G        part 
...
```

创建 Raid 矩阵

```bash
mdadm --create --verbose /dev/md0 --level=0 --raid-devices=3 /dev/sdb1 /dev/sdc1 /dev/sdd1
```

格式化 Raid 矩阵

```bash
mkfs.ext4 /dev/md0
```

挂载 Raid 矩阵

```bash
mkdir /mnt/raid
mount /dev/md0 /mnt/raid
```

配置自启动

```bash
echo '/dev/md0 /mnt/raid ext4 defaults,nofail,discard 0 0' | sudo tee -a /etc/fstab
```

保存 Raid 配置

```bash
mdadm --detail --scan | sudo tee -a /etc/mdadm/mdadm.conf
update-initramfs -u
```

