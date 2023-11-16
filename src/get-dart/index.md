---
title: Get the Dart SDK
title: 获取 Dart SDK
description: Get the libraries and command-line tools that you need to develop Dart web, command-line, and server apps.
description: 获得 Dart 命令行工具和库，用以编写 Dart web，命令行以及服务端应用。
js:
- url: /assets/js/get-dart/install.js
  defer: true
---

This page describes how to download the Dart SDK.
The Dart SDK has the libraries and command-line tools that you need to develop
Dart command-line, server, and non-Flutter web apps.
For details, see the [Dart SDK overview](/tools/sdk).

本页面主要引介绍如何下载 Dart SDK，Dart SDK 包含了各种
库和命令行工具帮助你构建 Dart 命令行、服务端、以及 Web (非 Flutter) 应用。
了解更多，请查看 [Dart SDK 概览](/tools/sdk)。

## Installing the Dart SDK {#install}

## 安装 Dart SDK {#install}

As the following instructions show,
you can use a package manager
to easily install and update a stable channel Dart SDK.
Alternatively, you can
[build the SDK from source][],
grab a [Dart Docker image][], or
install from [any release channel](#release-channels) by
[downloading the SDK as a zip file][].

如下所述，你可以使用包管理轻松地安装和更新 Dart SDK。
你也可以 以 [编译 SDK 源码][build the SDK from source] 的形式安装，
也可以在我们的 [各个发布渠道里](#release-channels) 
[下载 SDK 的 zip 压缩文件][downloading the SDK as a zip file] 。

{% comment %}
NOTE to editors: Keep the zip file link as the last thing in the paragraph,
so it's easy to find (but not more tempting than package managers).
{% endcomment %}

*Note*: The Flutter SDK includes the full Dart SDK,
and has Dart's [`dart`](/tools/dart-tool) command-line interface
in its `bin` folder.

{{site.alert.warn}}
  {% include_relative archive/_sdk-terms.md %}
{{site.alert.end}}

<ul class="tabs__top-bar">
  <li class="tab-link current" data-tab="tab-sdk-install-windows">Windows</li>
  <li class="tab-link" data-tab="tab-sdk-install-linux">Linux</li>
  <li class="tab-link" data-tab="tab-sdk-install-mac">macOS</li>
</ul>
<div id="tab-sdk-install-windows" class="tabs__content current" markdown="1">
{% include_relative _windows.md %}
</div>
<div id="tab-sdk-install-linux" class="tabs__content" markdown="1">
{% include_relative _linux.md %}
</div>
<div id="tab-sdk-install-mac" class="tabs__content" markdown="1">
{% include_relative _mac.md %}
</div>

## System requirements

## 系统要求

The Dart SDK is supported on Windows, Linux, and macOS.

Dart SDK 支持 Windows、Linux 和 macOS。

### Windows

* **Supported versions:** Windows 10 and 11.

  **支持的版本：**Windows 10 和 11。

* **Supported architectures:** x64, IA32, ARM64.<br>
  Support for ARM64 is in preview, and is available only in the dev and beta channels.

  **支持的架构：** x64、ia32、ARM64<br>
  ARM64 的支持处于实验性阶段，仅在 Dev 渠道可用。

### Linux

* **Supported versions:** [Debian stable][] and [Ubuntu LTS][] under standard support.

  **支持的版本：**已支持标准版的 [Debian stable][] 以及 [Ubuntu LTS][]。

* **Supported architectures:** x64, IA32, ARM64, ARM, RISC-V (RV64GC).<br>
  Support for RISC-V is in preview, and is available only in the dev and beta channels.

  **支持的架构：** x64、IA32、ARM64、ARM、RISC-V (RV64GC)。<br>
  RISC-V 的支持目前还在预览阶段，仅在 dev 和 beta 渠道可用。

{{site.alert.note}}

  The arm support requires glibc 2.23 or newer due to a
  [dynamic linker bug](https://sourceware.org/bugzilla/show_bug.cgi?id=14341).

  由于 [动态链接的缺陷](https://sourceware.org/bugzilla/show_bug.cgi?id=14341)，
  Arm 的支持需要使用 glibc 2.23 或更新的版本。

{{site.alert.end}}

### macOS

* **Supported versions:** Latest three major versions.
Dart supports the following macOS versions as of November 2023:
  - macOS 12 (Monterey)
  - macOS 13 (Ventura)
  - macOS 14 (Sonoma)

  **支持的版本：**最新的三个主要版本。
  截止 2022 年 11 月，支持 macOS 的以下版本：
  - macOS 12 (Monterey)
  - macOS 13 (Ventura)
  - macOS 14 (Sonoma)
  
* **Supported architectures:** x64, ARM64.

  **支持的架构：** x64、ARM64。

## About release channels and version strings {#release-channels}

## 关于发行渠道和版本字符串

The Dart SDK has three release channels:

Dart SDK 有三个发布渠道：

* **Stable** channel: **stable releases**, updated roughly every three months;
  currently `[calculating]`{:.build-rev-stable}.

  稳定版 (Stable) 渠道：**稳定发行版**，每 **三个月** 更新一次；
  当前版本 `[calculating]`{:.build-rev-stable}.
  
  Stable releases are suitable for production use.
  
  稳定版可适用于生产环境。
  
* **Beta** channel: **preview releases**, usually updated every month;
  currently `[calculating]`{:.build-rev-beta}.

  测试版 (Beta) 渠道：也称 **发行预览版**，通常 **每月** 更新一次；
  当前版本 `[calculating]`{:.build-rev-beta}.
  
  Beta channel builds are preview builds for the stable channel. We recommend
  testing, but not releasing, your apps against beta to preview new features or
  test compatibility with future releases.
  
  测试版渠道的构建是稳定版渠道的“预览版构建”。我们推荐您使用这个渠道的 SDK、
  进行测试，但是不建议您的应用发布，您可以用这个渠道的构建
  预览新功能或测试与未来版本的兼容性。
  
* **Dev** channel: **prereleases**, usually updated twice a week;
  currently `[calculating]`{:.build-rev-dev}.

  开发版 (Dev) 渠道：也称 **预发行版**，通常每 **双周** 更新一次；
  当前版本 `[calculating]`{:.build-rev-dev}.
  
  Dev channel releases are the most current with latest changes, may be broken,
  are unsupported, and may contain unvetted breaking changes.
  
  开发版渠道的构建包含最新的更新，也可能本身就是不完善的，这个版本我们不受支持，
  并且可能会包含未经审核的重大更改 (breaking changes)。

**Stable** channel releases of the Dart SDK have `x.y.z` version strings like
`1.24.3` and `2.1.0`. They consist of dot-separated integers, with no hyphens or
letters, where `x` is the major version, `y` is the minor version, and `z` is
the patch version.

Dart SDK **稳定版** 构建渠道的版本号设定为 `x.y.z`，比如 `1.24.3` 和 `2.1.0`。
它们由点分隔的整数组成，没有连字符或字母，
其中 `x` 是主版本，`y` 是次要版本，而 `z` 是补丁版本。

**Beta** and **dev** channel releases of the Dart SDK (non-stable releases) have
`x.y.z-a.b.<beta|dev>` versions like `2.8.0-20.11.beta`. The part before the
hyphen follows the stable version scheme, `a` and `b` after the hyphen are the
prerelease and prerelease patch versions, and `beta` or `dev` is the channel.

Dart SDK 的非稳定版 (**测试版 (Beta)** 和 **开发版 (Dev)**) 构建渠道
的版本号设定为：`x.y.z-a.b.<beta|dev>`，比如：`2.8.0-20.11.beta`。
连字符前的部分 (`x.y.z`) 遵循稳定版本方案，
连字符后的 `a` 和 `b` 分别是预发行版和预发行补丁版本，
而 `beta` 或 `dev` 是构建渠道通道标示。

You can get stable channel releases using
the [instructions above](#install), or you can
get stable, beta, or dev channel releases
using [a package manager][] or [Dart Docker image][], or
by [downloading the SDK as a zip file][].

你可以通过本页面 [上方安装部分](#install) 的介绍来获取稳定版渠道的 Dart，
或者通过 [任一个包管理器 (如 brew、choco、apt get)][a package manager][]
或者通过 Dart 的 [Docker 镜像][Dart Docker image] 来获取
稳定版 (Stable)、测试版 (Beta)、开发版 (Dev) 渠道的 Dart SDK，
再或者，你也可以直接 [下载各个版本的 SDK 压缩包][downloading the SDK as a zip file]。

[SDK constraints]: /tools/pub/pubspec#sdk-constraints
[build the SDK from source]: https://github.com/dart-lang/sdk/wiki/Building
[Dart libraries]: /guides/libraries/library-tour
[Dart Docker image]: https://hub.docker.com/_/dart
[downloading the SDK as a zip file]: /get-dart/archive
[Debian stable]: https://www.debian.org/releases
[Ubuntu LTS]: https://wiki.ubuntu.com/Releases
[flutter]: https://flutter.dev/docs/get-started/install
[site SDK version]: {{site.dart-api}}/{{site.data.pkg-vers.SDK.channel}}/{{site.data.pkg-vers.SDK.vers}}/index.html
[a package manager]: https://github.com/dart-lang/sdk/wiki/Installing-beta-and-dev-releases-with-brew,-choco,-and-apt-get
