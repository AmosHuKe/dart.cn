---
# title: How to use packages
title: 如何使用 package
short-title: Packages
# description: Learn more about pub, Dart's tool for managing packages.
description: 关于 pub 命令的更多介绍，这是 Dart 里用于管理 package 的工具。
---

The Dart ecosystem uses _packages_ to manage shared software
such as libraries and tools.
To get Dart packages, you use the **pub package manager**.
You can find publicly available packages on the
[**pub.dev site**,]({{site.pub}})
or you can load packages from the local file system or elsewhere,
such as Git repositories.
Wherever your packages come from, pub manages version dependencies,
helping you get package versions that work with each other and
with your SDK version.

Dart 生态系统使用 _package_ 来管理**共享软件**，比如：库和工具。
我们使用 **Pub package 管理工具** 来获取 Dart package。
在 [**Pub**]({{site.pub}}) 上，可以找到公开可用的 package。
或者从本地文件系统或其他的位置，比如 Git 仓库，加载可用的 package。
无论 package 是从什么途径加载的，Pub 都会进行版本依赖管理，
从而帮助我们获得版本兼容的软件包以及 SDK 。

Most [Dart-savvy IDEs][] offer support for using pub that
includes creating, downloading, updating, and publishing packages.
Or you can use [`dart pub` on the command line](/tools/pub/cmd).

大多数 [Dart-savvy IDEs][] 都支持 Pub 的使用，包括包的创建，下载，更新和发布。
同样上述功能也可以在命令行上通过 [`dart pub`](/tools/pub/cmd) 来操作。
或者可以在命令行上使用 pub。

At a minimum,
a Dart package is a directory containing a [pubspec file](/tools/pub/pubspec).
The pubspec contains some metadata about the package. 
Additionally, a package can contain dependencies (listed in the pubspec),
Dart libraries, apps, resources, tests, images, and examples.

Dart 包目录中至少包含一个 [pubspec 文件](/tools/pub/pubspec)。
pubspec 文件记录一些关于包的元数据。
此外，包还包含其他依赖项（在 pubspec 中列出），
Dart 库，应用，资源，测试，图片，以及示例。

To use a package, do the following:

通过以下步骤，引用使用包：

* Create a pubspec (a file named `pubspec.yaml` that
  lists package dependencies and includes
  other metadata, such as a version number).

  创建一个 pubspec （一个名为 `pubspec.yaml` 文件，
  文件列出依赖的包以及包含的其他元数据，比如当前包的版本）。

* Use [`dart pub get`][get] to retrieve your package's dependencies.

  使用 [`dart pub get`][get] 获取当前所依赖的包。

* If your Dart code depends on a library in the package, import the library.

  如果当前 Dart 代码依赖包中的某个库，导入 (import) 该库。

## Creating a pubspec

## 创建 pubspec

The pubspec is a file named `pubspec.yaml`
that's in the top directory of your application.
The simplest possible pubspec lists only the package name:

pubspec 是一个名为 `pubspec.yaml` 的文件，
文件位于应用的根路径。
最简单的 pubspec 只需要列出包名：

```yaml
name: my_app
```

Here is an example of a pubspec that declares dependencies on
two packages (`intl` and `path`) that are hosted on the pub.dev site:

下面是一个 pubspec 的示例，示例中声明依赖了在
Pub 站点上托管的两个 package（`intl` 和 `path`）：

```yaml
name: my_app

dependencies:
  intl: ^0.20.2
  path: ^1.9.1
```

To update the `pubspec.yaml` file, without manual editing, 
you can run `dart pub add` command.
The following example adds a dependency on `vector_math`.

你可以使用 `dart pub add` 来操作 `pubspec.yaml` 文件，无需手动修改。
下面的例子使用了命令来添加 `vector_math` package。

```console
$ dart pub add vector_math
Resolving dependencies... 
+ vector_math 2.1.3
Downloading vector_math 2.1.3...
Changed 1 dependency!
```

For details on creating a pubspec,
see the [pubspec documentation](/tools/pub/pubspec)
and the documentation for the packages that you want to use.

有关创建 pubspec 的详细内容，请参阅 [pubspec 文档](/tools/pub/pubspec)
以及使用 package 的相关文档。

## Getting packages

## 获取 package

Once you have a pubspec, you can run [`dart pub get`][get] from the top 
directory of your application:

项目中一旦拥有了 pubspec 文件，就可以在项目根目录中执行
[`dart pub get`][get] 命令：

```console
$ cd <path-to-my_app>
$ dart pub get
```

This process is called _getting the dependencies_.

上面的操作即 **获取依赖**。

The `dart pub get` command
determines which packages your app depends on,
and puts them in a central [system cache](/tools/pub/glossary#system-cache).
If your app depends on a published package, pub downloads that package from the
[pub.dev site.]({{site.pub}})
For a [Git dependency](/tools/pub/dependencies#git-packages),
pub clones the Git repository.
Transitive dependencies are included, too.
For example, if the `js` package depends on the `test` package, `pub`
grabs both the `js` package and the `test` package.

`dart pub get` 命令确定当前应用所依赖的包，
并将它们保存到中央 [系统缓存](/tools/pub/glossary#system-cache)
(central system cache) 中。
如果当前应用依赖了一个公开包， Pub 会从 [Pub 站点]({{site.pub}}) 获取该包。
对于一个 [Git 依赖](/tools/pub/dependencies#git-packages)，
Pub 会 Clone 该 Git 仓库。同样包括包的相关依赖也会被下载。
例如，如果 `js` 包依赖 `test` 包，`pub` 会同时获取 `js` 包和 `test` 包。

Pub creates a
`package_config.json` file (under the `.dart_tool/` directory)
that maps each package name that your app depends on
to the corresponding package in the system cache.

Pub 会创建一个 `package_config.json` 文件（位于 `.dart_tool/` 目录下），
该文件将应用程序所依赖的每个包名相应的映射到系统缓存中的包。

## Importing libraries from packages

## 从包中导入库

To import libraries found in packages, 
use the `package:` prefix:

使用 `package:` 前缀，导入包中的库：

```dart
import 'package:js/js.dart' as js;
import 'package:intl/intl.dart';
```

The Dart runtime takes everything after `package:`
and looks it up within the `package_config.json` file for
your app.

Dart 运行时会抓取 `package:` 之后的内容，
并在应用程序的 `package_config.json` 文件中查找它。

You can also use this style to import libraries from within your own package.
Let's say that the `transmogrify` package is laid out as follows:

你也可以使用此方式从自己的 package 中导入库。
比方说 `transmogrify` 这个 package 的结构如下：

```plaintext
transmogrify/
  lib/
    transmogrify.dart
    parser.dart
  test/
    parser/
      parser_test.dart
```

The `parser_test.dart` file can import `parser.dart` like this:

`parser_test.dart` 就可以通过下面的方式导入 `parser.dart`：

```dart
import 'package:transmogrify/parser.dart';
```


## Upgrading a dependency

## 升级依赖

The first time you get a new dependency for your package,
pub downloads the latest version of it that's compatible with
your other dependencies.
It then locks your package to *always* use that version by
creating a **lockfile**.
This is a file named `pubspec.lock` that pub creates
and stores next to your pubspec. 
It lists the specific versions of each dependency (immediate and transitive) 
that your package uses.

第一次获取依赖时，Pub 会下载依赖及其兼容的最新版本。
然后通过创建 **lockfile** 锁定依赖，以始终使用这个版本。
Pub 会在 pubspec 旁创建并存储一个名为 `pubspec.lock` 文件。
它列出了使用的每个依赖包的指定版本（当前包或传递包的版本）。

If your package is an [application package](/tools/pub/glossary#application-package)
you should check this file into
[source control](/tools/pub/private-files).
That way, everyone working on your app uses the same versions
of all of its dependencies.
Checking in the lockfile also ensures that your deployed app
uses the same versions of code.

如果包是一个 [应用程序包](/tools/pub/glossary#application-package)，
那么应该将此文件加入到 [源文件管理](/guides/libraries/private-files)。
这样，在应用上开发的每个人都能够使用所有相同版本的包。
同样加入到 lockfile 可以保证部署的应用使用的是同一版本的代码。

When you're ready to upgrade your dependencies to the latest versions,
use the [`dart pub upgrade`][upgrade] command:

如果已经准备更新依赖到最新版本，使用 [`dart pub upgrade`][upgrade] 命令：

```console
$ dart pub upgrade
```

The `dart pub upgrade` command tells pub to regenerate the lockfile,
using the newest available versions of your package's dependencies.
If you want to upgrade only one dependency,
you can specify the package to upgrade:

`dart pub upgrade` 命令用于重新生成 lockfile 文件，并使用最新可用版本的依赖包。
如果仅升级某个依赖，可以在命令中指定需要升级的包：

```console
$ dart pub upgrade transmogrify
```

That command upgrades `transmogrify` to the latest version
but leaves everything else the same.

上面的命令升级 `transmogrify` 到最新版本，但维持其它包不变。

The `dart pub upgrade` command can't always upgrade every package
to its latest version,
due to conflicting version constraints in the pubspec.
To identify out-of-date packages that require editing the pubspec,
use [`dart pub outdated`][outdated].

`dart pub upgrade` 命令并非总是可以将所有的 package 更新到最新版本，
原因是 pubspec 文件中的一些 package 之间有版本限制的冲突。
想要确定 pubspec 里已经过时且需要编辑的 package，
请使用 [`dart pub outdated`][outdated] 命令。

## Get dependencies for production

In some situations, `dart pub get` does not retrieve
the exact package versions locked in the `pubspec.lock` file:

* If new dependencies are added to or removed from `pubspec.yaml` after
  the `pubspec.lock` file was last updated.
* If the locked version no longer exists in the package repository.
* If you changed to a different version of the Dart SDK,
  and some packages are no longer compatible with that new version.
  
In these cases `dart pub get` will:

* Unlock enough of the locked dependency versions that
  a resolution becomes possible.
* Notify you about any dependency changes relative to
  the existing `pubspec.lock`.

For example, after adding `retry: ^3.0.0` to your dependencies:

```console
$ dart pub get
Resolving dependencies... (1.0s)
Downloading packages... 
+ retry 3.1.2
```

Also, if the [content hash][] of a published package version
differs from the hash in the `pubspec.lock` file, pub will
warn you and update the lockfile to reflect the published version.

For example, if you manually change the hash of `retry` in `pubspec.lock`:

```console
$ dart pub get
Resolving dependencies... 
Downloading packages... 
~ retry 3.1.2 (was 3.1.2)
The existing content-hash from pubspec.lock doesn't match contents for:
 * retry-3.1.2 from "https://pub.dev"

This indicates one of:
 * The content has changed on the server since you created the pubspec.lock.
 * The pubspec.lock has been corrupted.

The content-hashes in pubspec.lock has been updated.

For more information see:
https://dart.dev/go/content-hashes
Changed 1 dependency!
```

When deploying your project to production,
use `dart pub get --enforce-lockfile` to retrieve dependencies.

If your project's dependency constraints can't be
satisfied with the exact versions and content hashes in `pubspec.lock`,
package retrieval and the command will fail.
This helps avoid deploying untested
dependencies and dependency versions to production.

```console
$ dart pub get --enforce-lockfile
Resolving dependencies... 
Downloading packages... 
~ retry 3.1.2 (was 3.1.2)
The existing content-hash from pubspec.lock doesn't match contents for:
 * retry-3.1.2 from "https://pub.dev"

This indicates one of:
 * The content has changed on the server since you created the pubspec.lock.
 * The pubspec.lock has been corrupted.

For more information see:
https://dart.dev/go/content-hashes
Would change 1 dependency.
Unable to satisfy `pubspec.yaml` using `pubspec.lock`.

To update `pubspec.lock` run `dart pub get` without `--enforce-lockfile`.
```

[content hash]: /tools/pub/glossary#content-hashes

## More information

## 更多内容

The following pages have more information about packages and
the pub package manager.

以下链接的页面是关于包及 pub package 管理的更多内容。

### How to

### 如何使用

* [Creating packages](/tools/pub/create-packages)

  [创建 package](/tools/pub/create-packages)

* [Publishing packages](/tools/pub/publishing)

  [发布 package](/tools/pub/publishing)

* [Pub workspaces (monorepo support)](/tools/pub/workspaces)

  [Pub 工作区（支持 monorepo）](/tools/pub/workspaces)

### Reference

### 参考

* [Pub dependencies](/tools/pub/dependencies)
   
  [Pub 依赖](/tools/pub/dependencies)

* [Pub environment variables](/tools/pub/environment-variables)

  [Pub 环境变量](/tools/pub/environment-variables)

* [Pub glossary](/tools/pub/glossary)

  [Pub 术语](/tools/pub/glossary)

* [Pub package layout conventions](/tools/pub/package-layout)

  [Pub 包的布局约定](/tools/pub/package-layout)

* [Pub versioning philosophy](/tools/pub/versioning)
  
  [Pub 版本哲学](/tools/pub/versioning)

* [Pubspec format](/tools/pub/pubspec)

  [Pubspec 格式](/tools/pub/pubspec)

### Pub subcommands

### Pub 子命令

The `dart pub` tool provides the following subcommands:

{% render 'pub-subcommands.md' %}

For an overview of all the `dart pub` subcommands,
see the [pub tool documentation](/tools/pub/cmd).

有关所有 `pub` 命令的概述，
参见 [pub 工具文档](/tools/pub/cmd)。

### Troubleshooting

### 故障排除

[Troubleshooting pub](/tools/pub/troubleshoot) gives solutions to problems that
you might encounter when using pub.

[Pub 故障排除](/tools/pub/troubleshoot) 提供使用中可能遇到问题的解决方法。

[Dart-savvy IDEs]: /tools#editors
[get]: /tools/pub/cmd/pub-get
[upgrade]: /tools/pub/cmd/pub-upgrade
[outdated]: /tools/pub/cmd/pub-outdated
