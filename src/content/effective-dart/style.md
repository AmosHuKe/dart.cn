---
# title: "Effective Dart: Style"
title: 高效 Dart 语言指南：代码风格
description: Formatting and naming rules for consistent, readable code.
nextpage:
  url: /effective-dart/documentation
  # title: Documentation
  title: 文档
prevpage:
  url: /effective-dart
  # title: Overview
  title: 概览
---
<?code-excerpt plaster="none"?>
<?code-excerpt path-base="misc/lib/effective_dart"?>

A surprisingly important part of good code is good style. Consistent naming,
ordering, and formatting helps code that *is* the same *look* the same. It takes
advantage of the powerful pattern-matching hardware most of us have in our
ocular systems.  If we use a consistent style across the entire Dart ecosystem,
it makes it easier for all of us to learn from and contribute to each others'
code.

好的代码有一个非常重要的特点就是拥有好的风格。
一致的命名、一致的顺序、 以及一致的格式让代码看起来是一样的。
这非常有利于发挥我们视力系统强大的模式匹配能力。
如果我们整个 Dart 生态系统中都使用统一的风格，
那么这将让我们彼此之间更容易的互相学习和互相贡献。
它使我们所有人都可以更容易地学习并为彼此的代码做出贡献。

## Identifiers

## 标识符

Identifiers come in three flavors in Dart.

在 Dart 中标识符有三种类型。

* `UpperCamelCase` names capitalize the first letter of each word, including
  the first.

  `UpperCamelCase` 每个单词的首字母都大写，包含第一个单词。

* `lowerCamelCase` names capitalize the first letter of each word, *except*
  the first which is always lowercase, even if it's an acronym.

  `lowerCamelCase` 除了第一个字母始终是小写（即使是缩略词），每个单词的首字母都大写。

* `lowercase_with_underscores` names use only lowercase letters,
  even for acronyms, and separate words with `_`.

  `lowercase_with_underscores` 只使用小写字母单词，即使是缩略词，
  并且单词之间使用 `_` 连接。

### DO name types using `UpperCamelCase`

### **要** 使用 `UpperCamelCase` 风格命名类型。

{% render 'linter-rule-mention.md', rules:'camel_case_types' %}

Classes, enum types, typedefs, and type parameters should capitalize the first
letter of each word (including the first word), and use no separators.

Classes（类名）、 enums（枚举类型）、 typedefs（类型定义）、
以及 type parameters（类型参数）应该把每个单词的首字母都大写（包含第一个单词）， 
不使用分隔符。

<?code-excerpt "style_good.dart (type-names)"?>
```dart tag=good
class SliderMenu {
   ...
}

class HttpRequest {
   ...
}

typedef Predicate<T> = bool Function(T value);
```

This even includes classes intended to be used in metadata annotations.

这里包括使用元数据注解的类。

<?code-excerpt "style_good.dart (annotation-type-names)"?>
```dart tag=good
class Foo {
  const Foo([Object? arg]);
}

@Foo(anArg)
class A {
   ...
}

@Foo()
class B {
   ...
}
```

If the annotation class's constructor takes no parameters, you might want to
create a separate `lowerCamelCase` constant for it.

如果注解类的构造函数是无参函数，
则可以使用一个 `lowerCamelCase` 风格的常量来初始化这个注解。

<?code-excerpt "style_good.dart (annotation-const)"?>
```dart tag=good
const foo = Foo();

@foo
class C {
   ...
}
```

### DO name extensions using `UpperCamelCase`

### **要** 使用 `UpperCamelCase` 风格类型作为扩展名

{% render 'linter-rule-mention.md', rules:'camel_case_extensions' %}

Like types, [extensions][] should capitalize the first letter of each word
(including the first word),
and use no separators.

与类型命名一样，[扩展][extensions] 的名称也应大写每个单词的首字母
（包括第一个单词），并且不使用分隔符。

<?code-excerpt "style_good.dart (extension-names)"?>
```dart tag=good
extension MyFancyList<T> on List<T> {
   ...
}

extension SmartIterable<T> on Iterable<T> {
   ...
}
```

[extensions]: /language/extension-methods

<a id="do-name-libraries-and-source-files-using-lowercase_with_underscores"></a>
### DO name packages, directories, and source files using `lowercase_with_underscores` {:#do-name-packages-and-file-system-entities-using-lowercase-with-underscores}

### **要** 在`库`，`package`，`文件夹`，`源文件` 中使用 `lowercase_with_underscores` 方式命名

{% render 'linter-rule-mention.md', rules:'file_names, package_names' %}

Some file systems are not case-sensitive, so many projects require filenames to
be all lowercase. Using a separating character allows names to still be readable
in that form. Using underscores as the separator ensures that the name is still
a valid Dart identifier, which may be helpful if the language later supports
symbolic imports.

一些文件系统不区分大小写，所以很多项目要求文件名必须是小写字母。
使用分隔符这种形式可以保证命名的可读性。使用下划线作为分隔符可确保名称仍然是有效的Dart标识符，
如果语言后续支持符号导入，这将会起到非常大的帮助。

```plaintext tag=good
my_package
└─ lib
   └─ file_system.dart
   └─ slider_menu.dart
```

```plaintext tag=bad
mypackage
└─ lib
   └─ file-system.dart
   └─ SliderMenu.dart
```

  如果你 **选择命名库**，本准则给定了 **如何** 为库取名。
  如果需要，可以在文件中 **省略** 库指令。

{{site.alert.end}}

### DO name import prefixes using `lowercase_with_underscores`

### **要** 用 `lowercase_with_underscores` 风格命名库和源文件名。

{% render 'linter-rule-mention.md', rules:'library_prefixes' %}

<?code-excerpt "style_lib_good.dart (import-as)" replace="/(package):examples\/effective_dart\/foo.dart[^']*/$1:angular_components\/angular_components.dart/g; /(package):examples\/effective_dart\/bar.dart[^']*/$1:js\/js.dart/g"?>
```dart tag=good
import 'dart:math' as math;
import 'package:angular_components/angular_components.dart' as angular_components;
import 'package:js/js.dart' as js;
```

<?code-excerpt "style_lib_good.dart (import-as)" replace="/(package):examples\/effective_dart\/foo.dart[^']*/$1:angular_components\/angular_components.dart/g; /as angular_components/as angularComponents/g; /(package):examples\/effective_dart\/bar.dart[^']*/$1:js\/js.dart/g; / math/ Math/g;/as js/as JS/g"?>
```dart tag=bad
import 'dart:math' as Math;
import 'package:angular_components/angular_components.dart' as angularComponents;
import 'package:js/js.dart' as JS;
```


### DO name other identifiers using `lowerCamelCase`

### **要** 使用 `lowerCamelCase` 风格来命名其他的标识符。

{% render 'linter-rule-mention.md', rules:'non_constant_identifier_names' %}

Class members, top-level definitions, variables, parameters, and named
parameters should capitalize the first letter of each word *except* the first
word, and use no separators.

类成员、顶级定义、变量、参数以及命名参数等
*除了*第一个单词，每个单词首字母都应大写，并且不使用分隔符。

<?code-excerpt "style_good.dart (misc-names)"?>
```dart tag=good
var count = 3;

HttpRequest httpRequest;

void align(bool clearItems) {
  // ...
}
```


### PREFER using `lowerCamelCase` for constant names

### **推荐** 使用 `lowerCamelCase` 来命名常量。

{% render 'linter-rule-mention.md', rules:'constant_identifier_names' %}

In new code, use `lowerCamelCase` for constant variables, including enum values.

在新的代码中，使用 `lowerCamelCase` 来命名常量，包括枚举的值。

<?code-excerpt "style_good.dart (const-names)"?>
```dart tag=good
const pi = 3.14;
const defaultTimeout = 1000;
final urlScheme = RegExp('^([a-z]+):');

class Dice {
  static final numberGenerator = Random();
}
```

<?code-excerpt "style_bad.dart (const-names)"?>
```dart tag=bad
const PI = 3.14;
const DefaultTimeout = 1000;
final URL_SCHEME = RegExp('^([a-z]+):');

class Dice {
  static final NUMBER_GENERATOR = Random();
}
```

You may use `SCREAMING_CAPS` for consistency with existing code,
as in the following cases:

你可以使用 `SCREAMING_CAPS` 与现有代码保持一致，比如：

* When adding code to a file or library that already uses `SCREAMING_CAPS`.

  将代码添加到已使用 `SCREAMING_CAPS` 的文件或库时。

* When generating Dart code that's parallel to Java code—for example, 
  in enumerated types generated from [protobufs.][]

  生成与 Java 代码并行的 Dart 代码时。例如，来自 [protobufs][] 的枚举类型。

:::note

We initially used Java's `SCREAMING_CAPS` style for constants. We
changed for a few reasons:

我们一开始使用 Java `SCREAMING_CAPS` 风格来命名常量。
我们之所以不再使用，是因为：

* `SCREAMING_CAPS` looks bad for many cases,
  particularly enum values for things like CSS colors.

  `SCREAMING_CAPS` 很多情况下看起来比较糟糕，尤其类似于 CSS 颜色这类的枚举值。

* Constants are often changed to final non-const variables,
  which would necessitate a name change.

  常量经常被修改为 final 类型的非常量变量，这种情况你还需要修改变量命名为小写字母形式。

* The `values` property defined on an enum type is const and lowercase.

  在枚举类型中定义的 `values` 属性为常量并且是小写字母形式的。

:::

[protobufs.]: {{site.pub-pkg}}/protobuf
[protobufs]: {{site.pub-pkg}}/protobuf


### DO capitalize acronyms and abbreviations longer than two letters like words

### 把超过两个字母的首字母大写缩略词和缩写词当做一般单词来对待

Capitalized acronyms can be hard to read,
and multiple adjacent acronyms can lead to ambiguous names.
For example, given an identifier `HTTPSFTP`,
the reader can't tell if it refers to `HTTPS` `FTP` or `HTTP` `SFTP`.
To avoid this,
capitalize most acronyms and abbreviations like regular words.
This identifier would be `HttpsFtp` if referring to the former
or `HttpSftp` for the latter.

首字母大写缩略词比较难阅读，
特别是多个缩略词连在一起的时候会引起歧义。
例如，一个名为 `HTTPSFTP` 的标识符，
没有办法分辨它是指 `HTTPS` `FTP` 还是 `HTTP` `SFTP`。
为避免出现这种情况，
大多数缩略词和缩写词都要像普通单词一样大写。
如果是前者，则应为 `HttpsFtp`，
如果是后者，则应为 `HttpSftp`。

Two-letter abbreviations and acronyms are the exception.
If both letters are capitalized in English,
then they should both stay capitalized when used in an identifier.
Otherwise, capitalize it like a word.

双字母缩写词和首字母缩略词是个例外的情况。
如果两个字母在英语中都是大写，
那么在标识符中使用时也应该保持大写。
否则，应该像单词一样首字母大写。

```dart tag=good
// Longer than two letters, so always like a word:
Http // "hypertext transfer protocol"
Nasa // "national aeronautics and space administration"
Uri // "uniform resource identifier"
Esq // "esquire"
Ave // "avenue"

// Two letters, capitalized in English, so capitalized in an identifier:
ID // "identifier"
TV // "television"
UI // "user interface"

// Two letters, not capitalized in English, so like a word in an identifier:
Mr // "mister"
St // "street"
Rd // "road"
```

```dart tag=bad
HTTP // "hypertext transfer protocol"
NASA // "national aeronautics and space administration"
URI // "uniform resource identifier"
esq // "esquire"
ave // "avenue"

Id // "identifier"
Tv // "television"
Ui // "user interface"

MR // "mister"
ST // "street"
RD // "road"
```

When any form of abbreviation comes at the beginning
of a `lowerCamelCase` identifier, the abbreviation should be all lowercase:

```dart
var httpConnection = connect();
var tvSet = Television();
var mrRogers = 'hello, neighbor';
```

<a id="prefer-using-_-__-etc-for-unused-callback-parameters" aria-hidden="true"></a>

### PREFER using wildcards for unused callback parameters

Sometimes the type signature of a callback function requires a parameter,
but the callback implementation doesn't _use_ the parameter.
In this case, it's idiomatic to name the unused parameter `_`,
which declares a [wildcard variable][wildcards] that is non-binding.

<?code-excerpt "style_good.dart (unused-callback-param)"?>
```dart tag=good
futureOfVoid.then((_) {
  print('Operation complete.');
});
```

Because wildcard variables are non-binding,
you can name multiple unused parameters `_`.

<?code-excerpt "style_good.dart (unused-callback-params-multiple)"?>
```dart tag=good
.onError((_, _) {
  print('Operation failed.');
});
```

This guideline is only for functions that are both *anonymous and local*.
These functions are usually used immediately in a context where it's
clear what the unused parameter represents.
In contrast, top-level functions and method declarations don't have that context,
so their parameters must be named so that it's clear what each parameter is for,
even if it isn't used.

:::version-note
Declaring non-binding [wildcard variables][wildcards] requires
a [language version][] of at least 3.7.

In earlier language versions, use additional underscores to
work around name collisions, such as `__` and `___`.
To enforce not using them and simplify the migration to wildcards later on,
enable the [`no_wildcard_variable_uses`][] lint.

To help migrate from this convention to wildcard variables,
enable the [`unnecessary_underscores`][] lint.
:::

[wildcards]: /language/variables#wildcard-variables
[language version]: /resources/language/evolution#language-versioning
[`no_wildcard_variable_uses`]: /tools/linter-rules/no_wildcard_variable_uses
[`unnecessary_underscores`]: /tools/linter-rules/unnecessary_underscores

### DON'T use a leading underscore for identifiers that aren't private

Dart uses a leading underscore in an identifier to mark members and top-level
declarations as private. This trains users to associate a leading underscore
with one of those kinds of declarations. They see "_" and think "private".

There is no concept of "private" for local variables, parameters, local
functions, or library prefixes. When one of those has a name that starts with an
underscore, it sends a confusing signal to the reader. To avoid that, don't use
leading underscores in those names.


### DON'T use prefix letters

### **不要**使用前缀字母

[Hungarian notation](https://en.wikipedia.org/wiki/Hungarian_notation) and
other schemes arose in the time of BCPL, when the compiler didn't do much to
help you understand your code. Because Dart can tell you the type, scope,
mutability, and other properties of your declarations, there's no reason to
encode those properties in identifier names.

在编译器无法帮助你了解自己代码的时，
[匈牙利命名法](https://en.wikipedia.org/wiki/Hungarian_notation)
和其他方案出现在了 BCPL ，
但是因为 Dart 可以提示你声明的类型，范围，可变性和其他属性，
所以没有理由在标识符名称中对这些属性进行编码。

```dart tag=good
defaultTimeout
```

```dart tag=bad
kDefaultTimeout
```

### DON'T explicitly name libraries

Appending a name to the `library` directive is technically possible,
but is a legacy feature and discouraged. 

Dart generates a unique tag for each library
based on its path and filename.
Naming libraries overrides this generated URI.
Without the URI, it can be harder for tools to find
the main library file in question. 

<?code-excerpt "usage_bad.dart (library-dir)"?>
```dart tag=bad
library my_library;
```

<?code-excerpt "docs_good.dart (library-doc)"?>
```dart tag=good
/// A really great test library.
@TestOn('browser')
library;
```

## Ordering

## 顺序

To keep the preamble of your file tidy, we have a prescribed order that
directives should appear in. Each "section" should be separated by a blank line.

为了使文件前面部分保持整洁，我们规定了关键字出现顺序的规则。
每个“部分”应该使用空行分割。

A single linter rule handles all the ordering guidelines:
[directives_ordering.](/tools/linter-rules/directives_ordering)


### DO place `dart:` imports before other imports

### **要** 把 "dart:" 导入语句放到其他导入语句之前。

{% render 'linter-rule-mention.md', rules:'directives_ordering' %}

<?code-excerpt "style_lib_good.dart (dart-import-first)" replace="/\w+\/effective_dart\///g"?>
```dart tag=good
import 'dart:async';
import 'dart:collection';

import 'package:bar/bar.dart';
import 'package:foo/foo.dart';
```


### DO place `package:` imports before relative imports

### **要** 把 "package:" 导入语句放到项目相关导入语句之前。

{% render 'linter-rule-mention.md', rules:'directives_ordering' %}

<?code-excerpt "style_lib_good.dart (pkg-import-before-local)" replace="/\w+\/effective_dart\///g;/'foo/'util/g"?>
```dart tag=good
import 'package:bar/bar.dart';
import 'package:foo/foo.dart';

import 'util.dart';
```


### DO specify exports in a separate section after all imports

### **要** 把导出 (export) 语句作为一个单独的部分放到所有导入语句之后。

{% render 'linter-rule-mention.md', rules:'directives_ordering' %}

<?code-excerpt "style_lib_good.dart (export)"?>
```dart tag=good
import 'src/error.dart';
import 'src/foo_bar.dart';

export 'src/error.dart';
```

<?code-excerpt "style_lib_bad.dart (export)"?>
```dart tag=bad
import 'src/error.dart';
export 'src/error.dart';
import 'src/foo_bar.dart';
```


### DO sort sections alphabetically

### **要** 按照字母顺序来排序每个部分中的语句。

{% render 'linter-rule-mention.md', rules:'directives_ordering' %}

<?code-excerpt "style_lib_good.dart (sorted)" replace="/\w+\/effective_dart\///g"?>
```dart tag=good
import 'package:bar/bar.dart';
import 'package:foo/foo.dart';

import 'foo.dart';
import 'foo/foo.dart';
```

<?code-excerpt "style_lib_bad.dart (sorted)" replace="/\w+\/effective_dart\///g"?>
```dart tag=bad
import 'package:foo/foo.dart';
import 'package:bar/bar.dart';

import 'foo/foo.dart';
import 'foo.dart';
```


## Formatting

## 格式化

Like many languages, Dart ignores whitespace. However, *humans* don't. Having a
consistent whitespace style helps ensure that human readers see code the same
way the compiler does.

和其他大部分语言一样， Dart 忽略空格。但是，*人*不会。
具有一致的空格风格有助于帮助我们能够用编译器相同的方式理解代码。

### DO format your code using `dart format`

### **要** 使用 `dart format` 格式化你的代码。

Formatting is tedious work and is particularly time-consuming during
refactoring. Fortunately, you don't have to worry about it. We provide a
sophisticated automated code formatter called [`dart format`][] that does it for
you. The official whitespace-handling rules for Dart are
*whatever `dart format` produces*. The [formatter FAQ][] can provide more insight
into the style choices it enforces.

格式化是一项繁琐的工作，尤其在重构过程中特别耗时。
庆幸的是，你不必担心。
我们提供了一个名为 [`dart format`][] 的优秀的自动代码格式化程序，它可以为你完成格式化工作。
Dart 中任何官方的空格处理规则由 *`dart format` 生成*。
你可以参考 [格式化程序常见问题][formatter FAQ] 了解更多关于它强制执行的样式风格。

The remaining formatting guidelines are for the few things `dart format` cannot
fix for you.  

其余格式指南用于 `dart format` 无法修复的一些规则。

[`dart format`]: /tools/dart-format
[formatter FAQ]: {{site.repo.dart.org}}/dart_style/wiki/FAQ

### CONSIDER changing your code to make it more formatter-friendly

### **考虑** 修改你的代码让格式更友好。

The formatter does the best it can with whatever code you throw at it, but it
can't work miracles. If your code has particularly long identifiers, deeply
nested expressions, a mixture of different kinds of operators, etc. the
formatted output may still be hard to read.

无论你扔给格式化程序什么样代码，它都会尽力去处理，
但是格式化程序不会创造奇迹。
如果代码里有特别长的标识符，深层嵌套的表达式，混合的不同类型运算符等。
格式化输出的代码可能任然很难阅读。

When that happens, reorganize or simplify your code. Consider shortening a local
variable name or hoisting out an expression into a new local variable. In other
words, make the same kinds of modifications that you'd make if you were
formatting the code by hand and trying to make it more readable. Think of
`dart format` as a partnership where you work together, sometimes iteratively, 
to produce beautiful code.

当有这样的情况发生时，那么就需要重新组织或简化你的代码。
考虑缩短局部变量名或者将表达式抽取为一个新的局部变量。
换句话说，你应该做一些手动格式化并增加代码的可读性的修改。
在工作中应该把 `dart format` 看做一个合作伙伴，
在代码的编写和迭代过程中互相协作输出优质的代码。

<a id="avoid-lines-longer-than-80-characters"></a>
### PREFER lines 80 characters or fewer

### **推荐** 单行少于 80 个字符。

{% render 'linter-rule-mention.md', rules:'lines_longer_than_80_chars' %}

Readability studies show that long lines of text are harder to read because your
eye has to travel farther when moving to the beginning of the next line. This is
why newspapers and magazines use multiple columns of text.

可读性研究表明，长行的文字不易阅读，
长行文字移动到下一行的开头时，眼睛需要移动更长的距离。
这也是为什么报纸和杂志会使用多列样式的文字排版。

If you really find yourself wanting lines longer than 80 characters, our
experience is that your code is likely too verbose and could be a little more
compact. The main offender is usually `VeryLongCamelCaseClassNames`. Ask
yourself, "Does each word in that type name tell me something critical or
prevent a name collision?" If not, consider omitting it.

如果你真的发现你需要的文字长度超过了 80 个字符，
根据我们的经验，你的代码很可能过于冗长，
而且有方式可以让它更紧凑。
最常见的的一种情况就是使用 `VeryLongCamelCaseClassNames` （非常长的类名字和变量名字）。
当遇到这种情况时，请自问一下：“那个类型名称中的每个单词都会告诉我一些关键的内容或阻止名称冲突吗？”，
如果不是，考虑删除它。

Note that `dart format` defaults to 80 characters or fewer, though you can
[configure][] the default. 
It does not split long string literals to fit in 80 columns, 
so you have to do that manually.

注意，`dart format` 默认为 80 个（或更少）字符，你可以自行 [配置][configure] 默认值。
`dart format` 不会把很长的字符串字面量分割为 80 个字符的列，
所以这种情况你**需要**自己手工确保每行不超过 80 个字符。

**Exception:** When a URI or file path occurs in a comment or string (usually in
an import or export), it may remain whole even if it causes the line to go over
80 characters. This makes it easier to search source files for a path.

**例外：** 当 URI 及文件路径出现在注释或字符串中时（通常在导入和导出语句中），
即使文字超出行限制，也可能会保留在一行中。
这样可以更轻松地搜索给定路径的源文件。

**Exception:** Multi-line strings can contain lines longer than 80 characters
because newlines are significant inside the string and splitting the lines into
shorter ones can alter the program.

[configure]: /tools/dart-format#configuring-formatter-page-width

<a id="do-use-curly-braces-for-all-flow-control-structures"></a>
### DO use curly braces for all flow control statements

### **要** 对所有流控制结构使用花括号。

{% render 'linter-rule-mention.md', rules:'curly_braces_in_flow_control_structures' %}

Doing so avoids the [dangling else][] problem.

这样可以避免 [dangling else][]（else悬挂）的问题。

[dangling else]: https://en.wikipedia.org/wiki/Dangling_else

<?code-excerpt "style_good.dart (curly-braces)"?>
```dart tag=good
if (isWeekDay) {
  print('Bike to work!');
} else {
  print('Go dancing or read a book!');
}
```

**Exception:** When you have an `if` statement with no `else` clause and the
whole `if` statement fits on one line, you can omit the braces if you prefer:

这里有一个例外：一个没有 `else` 的 `if` 语句，
并且这个 `if` 语句以及它的执行体适合在一行中实现。
在这种情况下，如果你愿意，可以不用括号：

<?code-excerpt "style_good.dart (one-line-if)"?>
```dart tag=good
if (arg == null) return defaultValue;
```

If the body wraps to the next line, though, use braces:

但是，如果执行体包含下一行，请使用大括号：

<?code-excerpt "style_good.dart (one-line-if-wrap)"?>
```dart tag=good
if (overflowChars != other.overflowChars) {
  return overflowChars < other.overflowChars;
}
```

<?code-excerpt "style_bad.dart (one-line-if-wrap)"?>
```dart tag=bad
if (overflowChars != other.overflowChars)
  return overflowChars < other.overflowChars;
```
