---
# title: "Effective Dart: Usage"
title: 高效 Dart 语言指南：用法示例
# description: Guidelines for using language features to write maintainable code.
description: 指导你利用语言特性写出便于维护的代码。
nextpage:
  url: /effective-dart/design
  # title: Design
  title: API 设计
prevpage:
  url: /effective-dart/documentation
  # title: Documentation
  title: 文档
---
<?code-excerpt plaster="none"?>
<?code-excerpt replace="/([A-Z]\w*)\d\b/$1/g"?>
<?code-excerpt path-base="misc/lib/effective_dart"?>

You can use these guidelines every day in the bodies of your Dart code. *Users*
of your library may not be able to tell that you've internalized the ideas here,
but *maintainers* of it sure will.

每天在你写的 Dart 代码中都会应用到这些准则。
库的*使用者*可能不需要知道你在其中的一些想法，
但是*维护者*肯定是需要的。

## Libraries

## 库

These guidelines help you compose your program out of multiple files in a
consistent, maintainable way. To keep these guidelines brief, they use "import"
to cover `import` and `export` directives. The guidelines apply equally to both. 

这些准则可以帮助你在多个文件编写程序的情况下保证一致性和可维护性。
为了让准则简洁，这里使用“import”来同时代表 `import` 和 `export` 。
准则同时适用于这两者。

### DO use strings in `part of` directives

{% render 'linter-rule-mention.md', rules:'use_string_in_part_of_directives' %}

### **要** 在 `part of` 中使用字符串

Many Dart developers avoid using `part` entirely. They find it easier to reason
about their code when each library is a single file. If you do choose to use
`part` to split part of a library out into another file, Dart requires the other
file to in turn indicate which library it's a part of. 

很多 Dart 开发者会避免直接使用 `part` 。他们发现当库仅有一个文件的时候很容易读懂代码。
如果你确实要使用 `part` 将库的一部分拆分为另一个文件，则 Dart 要求另一个文件指示它所属库的路径。 

Dart allows the `part of` directive to use the *name* of a library.
Naming libraries is a legacy feature that is now [discouraged][]. 
Library names can introduce ambiguity
when determining which library a part belongs to.

由于遗留原因，Dart 允许 `part of` 指令使用它所属的库的 *名称*。
这使得工具很难直接查找到这个文件对应主库文件，使得库和文件之间的关系模糊不清。

[discouraged]: /effective-dart/style#dont-explicitly-name-libraries

The preferred syntax is to use a URI string that points
directly to the library file. 
If you have some library, `my_library.dart`, that contains:

推荐的现代语法是使用 URI 字符串直接指向库文件。
如果你有一些库，`my_library.dart`，其中包含：

<?code-excerpt "my_library.dart" remove="ignore_for_file"?>
```dart title="my_library.dart"
library my_library;

part 'some/other/file.dart';
```

Then the part file should use the library file's URI string:

从库中拆分的文件应该如下所示：

<?code-excerpt "some/other/file.dart"?>
```dart tag=good
part of '../../my_library.dart';
```

Not the library name:

而不是：

<?code-excerpt "some/other/file_2.dart (part-of)"?>
```dart tag=bad
part of my_library;
```

### DON'T import libraries that are inside the `src` directory of another package

### **不要** 导入 package 中 `src` 目录下的库

{% render 'linter-rule-mention.md', rules:'implementation_imports' %}

The `src` directory under `lib` [is specified][package guide] to contain
libraries private to the package's own implementation. The way package
maintainers version their package takes this convention into account. They are
free to make sweeping changes to code under `src` without it being a breaking
change to the package.

`lib` 下的 `src` 目录 [被指定][package guide] 为 package 自己实现的私有库。
基于包维护者对版本的考虑，package 使用了这种约定。
在不破坏 package 的情况下，维护者可以自由地对 `src` 目录下的代码进行修改。

[package guide]: /tools/pub/package-layout

That means that if you import some other package's private library, a minor,
theoretically non-breaking point release of that package could break your code.

这意味着，你如果导入了其中的私有库，
按理论来讲，一个不破坏 package 的次版本就会影响到你的代码。

### DON'T allow an import path to reach into or out of `lib`

{% render 'linter-rule-mention.md', rules:'avoid_relative_lib_imports' %}

A `package:` import lets you access
a library inside a package's `lib` directory
without having to worry about where the package is stored on your computer.
For this to work, you cannot have imports that require the `lib`
to be in some location on disk relative to other files.
In other words, a relative import path in a file inside `lib`
can't reach out and access a file outside of the `lib` directory,
and a library outside of `lib` can't use a relative path
to reach into the `lib` directory.
Doing either leads to confusing errors and broken programs.

For example, say your directory structure looks like this:

```plaintext
my_package
└─ lib
   └─ api.dart
   test
   └─ api_test.dart
```

And say `api_test.dart` imports `api.dart` in two ways:

```dart title="api_test.dart" tag=bad
import 'package:my_package/api.dart';
import '../lib/api.dart';
```

Dart thinks those are imports of two completely unrelated libraries.
To avoid confusing Dart and yourself, follow these two rules:

* Don't use `/lib/` in import paths.
* Don't use `../` to escape the `lib` directory.

Instead, when you need to reach into a package's `lib` directory
(even from the same package's `test` directory
or any other top-level directory),
use a `package:` import.

```dart title="api_test.dart" tag=good
import 'package:my_package/api.dart';
```

A package should never reach *out* of its `lib` directory and
import libraries from other places in the package.


### PREFER relative import paths

{% render 'linter-rule-mention.md', rules:'prefer_relative_imports' %}

Whenever the previous rule doesn't come into play, follow this one.
When an import does *not* reach across `lib`, prefer using relative imports.
They're shorter.
For example, say your directory structure looks like this:

比如，下面是你的 package 目录结构：

```plaintext
my_package
└─ lib
   ├─ src
   │  └─ stuff.dart
   │  └─ utils.dart
   └─ api.dart
   test
   │─ api_test.dart
   └─ test_utils.dart
```

Here is how the various libraries should import each other:

**lib/api.dart:**

如果 `api.dart` 想导入 `utils.dart` ，应该这样使用：

```dart title="lib/api.dart" tag=good
import 'src/stuff.dart';
import 'src/utils.dart';
```

```dart title="lib/src/utils.dart" tag=good
import '../api.dart';
import 'stuff.dart';
```

```dart title="test/api_test.dart" tag=good
import 'package:my_package/api.dart'; // Don't reach into 'lib'.

import 'test_utils.dart'; // Relative within 'test' is fine.
```


## Null


### DON'T explicitly initialize variables to `null`

{% render 'linter-rule-mention.md', rules:'avoid_init_to_null' %}

If a variable has a non-nullable type, Dart reports a compile error if you try
to use it before it has been definitely initialized. If the variable is
nullable, then it is implicitly initialized to `null` for you. There's no
concept of "uninitialized memory" in Dart and no need to explicitly initialize a
variable to `null` to be "safe".

<?code-excerpt "usage_good.dart (no-null-init)"?>
```dart tag=good
Item? bestDeal(List<Item> cart) {
  Item? bestItem;

  for (final item in cart) {
    if (bestItem == null || item.price < bestItem.price) {
      bestItem = item;
    }
  }

  return bestItem;
}
```

<?code-excerpt "usage_bad.dart (no-null-init)" replace="/ = null/[!$&!]/g"?>
```dart tag=bad
Item? bestDeal(List<Item> cart) {
  Item? bestItem[! = null!];

  for (final item in cart) {
    if (bestItem == null || item.price < bestItem.price) {
      bestItem = item;
    }
  }

  return bestItem;
}
```


### DON'T use an explicit default value of `null`

{% render 'linter-rule-mention.md', rules:'avoid_init_to_null' %}

If you make a nullable parameter optional but don't give it a default value, the
language implicitly uses `null` as the default, so there's no need to write it.

<?code-excerpt "usage_good.dart (default-value-null)"?>
```dart tag=good
void error([String? message]) {
  stderr.write(message ?? '\n');
}
```

<?code-excerpt "usage_bad.dart (default-value-null)"?>
```dart tag=bad
void error([String? message = null]) {
  stderr.write(message ?? '\n');
}
```

<a id="prefer-using--to-convert-null-to-a-boolean-value"></a>
### DON'T use `true` or `false` in equality operations

Using the equality operator to evaluate a *non-nullable* boolean expression 
against a boolean literal is redundant. 
It's always simpler to eliminate the equality operator, 
and use the unary negation operator `!` if necessary:

<?code-excerpt "usage_good.dart (non-null-boolean-expression)"?>
```dart tag=good
if (nonNullableBool) {
   ...
}

if (!nonNullableBool) {
   ...
}
```

<?code-excerpt "usage_bad.dart (non-null-boolean-expression)"?>
```dart tag=bad
if (nonNullableBool == true) {
   ...
}

if (nonNullableBool == false) {
   ...
}
```

To evaluate a boolean expression that *is nullable*, you should use `??`
or an explicit `!= null` check.

<?code-excerpt "usage_good.dart (nullable-boolean-expression)"?>
```dart tag=good
// If you want null to result in false:
if (nullableBool ?? false) {
   ...
}

// If you want null to result in false
// and you want the variable to type promote:
if (nullableBool != null && nullableBool) {
   ...
}
```

<?code-excerpt "usage_bad.dart (nullable-boolean-expression)"?>
```dart tag=bad
// Static error if null:
if (nullableBool) {
   ...
}

// If you want null to be false:
if (nullableBool == true) {
   ...
}
```

`nullableBool == true` is a viable expression, 
but shouldn't be used for several reasons:

* It doesn't indicate the code has anything to do with `null`.

* Because it's not evidently `null` related, 
  it can easily be mistaken for the non-nullable case,
  where the equality operator is redundant and can be removed.
  That's only true when the boolean expression on the left
  has no chance of producing null, but not when it can.

* The boolean logic is confusing. If `nullableBool` is null, 
  then `nullableBool == true` means the condition evaluates to `false`.

The `??` operator makes it clear that something to do with null is happening,
so it won't be mistaken for a redundant operation. 
The logic is much clearer too; 
the result of the expression being `null` is the same as the boolean literal.

Using a null-aware operator such as `??` on a variable inside a condition
doesn't promote the variable to a non-nullable type. 
If you want the variable to be promoted inside the body of the `if` statement,
it's better to use an explicit `!= null` check instead of `??`. 

### AVOID `late` variables if you need to check whether they are initialized

Dart offers no way to tell if a `late` variable
has been initialized or assigned to.
If you access it, it either immediately runs the initializer
(if it has one) or throws an exception.
Sometimes you have some state that's lazily initialized
where `late` might be a good fit,
but you also need to be able to *tell* if the initialization has happened yet.

Although you could detect initialization by storing the state in a `late` variable
and having a separate boolean field
that tracks whether the variable has been set,
that's redundant because Dart *internally*
maintains the initialized status of the `late` variable.
Instead, it's usually clearer to make the variable non-`late` and nullable.
Then you can see if the variable has been initialized
by checking for `null`.

Of course, if `null` is a valid initialized value for the variable,
then it probably does make sense to have a separate boolean field.


### CONSIDER type promotion or null-check patterns for using nullable types

Checking that a nullable variable is not equal to `null` promotes the variable
to a non-nullable type. That lets you access members on the variable and pass it
to functions expecting a non-nullable type.

Type promotion is only supported, however, for local variables, parameters, and
private final fields. Values that are open to manipulation
[can't be type promoted][].

Declaring members [private][] and [final][], as we generally recommend, is often
enough to bypass these limitations. But, that's not always an option.

One pattern to work around type promotion limitations is to use a
[null-check pattern][]. This simultaneously confirms the member's value
is not null, and binds that value to a new non-nullable variable of
the same base type.

<?code-excerpt "usage_good.dart (null-check-promo)"?>
```dart tag=good
class UploadException {
  final Response? response;

  UploadException([this.response]);

  @override
  String toString() {
    if (this.response case var response?) {
      return 'Could not complete upload to ${response.url} '
          '(error code ${response.errorCode}): ${response.reason}.';
    }
    return 'Could not upload (no response).';
  }
}
```

Another work around is to assign the field's value
to a local variable. Null checks on that variable will promote,
so you can safely treat it as non-nullable.

<?code-excerpt "usage_good.dart (shadow-nullable-field)"?>
```dart tag=good
class UploadException {
  final Response? response;

  UploadException([this.response]);

  @override
  String toString() {
    final response = this.response;
    if (response != null) {
      return 'Could not complete upload to ${response.url} '
          '(error code ${response.errorCode}): ${response.reason}.';
    }
    return 'Could not upload (no response).';
  }
}
```

Be careful when using a local variable. If you need to write back to the field,
make sure that you don't write back to the local variable instead. (Making the
local variable [`final`][] can prevent such mistakes.) Also, if the field might
change while the local is still in scope, then the local might have a stale
value. 

Sometimes it's best to simply [use `!`][] on the field. 
In some cases, though, using either a local variable or a null-check pattern 
can be cleaner and safer than using `!` every time you need to treat the value
as non-null:

<?code-excerpt "usage_bad.dart (shadow-nullable-field)" replace="/!\./[!!!]./g"?>
```dart tag=bad
class UploadException {
  final Response? response;

  UploadException([this.response]);

  @override
  String toString() {
    if (response != null) {
      return 'Could not complete upload to ${response[!!!].url} '
          '(error code ${response[!!!].errorCode}): ${response[!!!].reason}.';
    }

    return 'Could not upload (no response).';
  }
}
```

[can't be type promoted]: /tools/non-promotion-reasons
[private]: /effective-dart/design#prefer-making-declarations-private
[final]: /effective-dart/design#prefer-making-fields-and-top-level-variables-final
[null-check pattern]: /language/pattern-types#null-check
[`final`]: /effective-dart/usage#do-follow-a-consistent-rule-for-var-and-final-on-local-variables
[use `!`]: /null-safety/understanding-null-safety#not-null-assertion-operator

## Strings

## 字符串

Here are some best practices to keep in mind when composing strings in Dart.

下面是一些需要记住的，关于在 Dart 中使用字符串的最佳实践。

### DO use adjacent strings to concatenate string literals

### **要** 使用相邻字符串的方式连接字面量字符串

{% render 'linter-rule-mention.md', rules:'prefer_adjacent_string_concatenation' %}

If you have two string literals—not values, but the actual quoted literal
form—you do not need to use `+` to concatenate them. Just like in C and
C++, simply placing them next to each other does it. This is a good way to make
a single long string that doesn't fit on one line.

如果你有两个字面量字符串（不是变量，是放在引号中的字符串），
你不需要使用 `+` 来连接它们。
应该像 C 和 C++ 一样，只需要将它们挨着在一起就可以了。
这种方式非常适合不能放到一行的长字符串的创建。

<?code-excerpt "usage_good.dart (adjacent-strings-literals)"?>
```dart tag=good
raiseAlarm(
  'ERROR: Parts of the spaceship are on fire. Other '
  'parts are overrun by martians. Unclear which are which.',
);
```

<?code-excerpt "usage_bad.dart (adjacent-strings-literals)"?>
```dart tag=bad
raiseAlarm(
  'ERROR: Parts of the spaceship are on fire. Other ' +
      'parts are overrun by martians. Unclear which are which.',
);
```

### PREFER using interpolation to compose strings and values

### **推荐** 使用插值的形式来组合字符串和值

{% render 'linter-rule-mention.md', rules:'prefer_interpolation_to_compose_strings' %}

If you're coming from other languages, you're used to using long chains of `+`
to build a string out of literals and other values. That does work in Dart, but
it's almost always cleaner and shorter to use interpolation:

如果你之前使用过其他语言，你一定习惯使用大量 `+` 将字面量字符串以及字符串变量链接构建字符串。
这种方式在 Dart 中同样有效，但是通常情况下使用插值会更清晰简短：

<?code-excerpt "usage_good.dart (string-interpolation)"?>
```dart tag=good
'Hello, $name! You are ${year - birth} years old.';
```

<?code-excerpt "usage_bad.dart (string-interpolation)"?>
```dart tag=bad
'Hello, ' + name + '! You are ' + (year - birth).toString() + ' y...';
```

Note that this guideline applies to combining *multiple* literals and values.
It's fine to use `.toString()` when converting only a single object to a string.

### AVOID using curly braces in interpolation when not needed

### **避免** 在字符串插值中使用不必要的大括号

{% render 'linter-rule-mention.md', rules:'unnecessary_brace_in_string_interps' %}

If you're interpolating a simple identifier not immediately followed by more
alphanumeric text, the `{}` should be omitted.

如果要插入是一个简单的标识符，并且后面没有紧跟随在其他字母文本，则应省略 `{}` 。

<?code-excerpt "usage_good.dart (string-interpolation-avoid-curly)"?>
```dart tag=good
var greeting = 'Hi, $name! I love your ${decade}s costume.';
```

<?code-excerpt "usage_bad.dart (string-interpolation-avoid-curly)"?>
```dart tag=bad
var greeting = 'Hi, ${name}! I love your ${decade}s costume.';
```

## Collections

## 集合

Out of the box, Dart supports four collection types: lists, maps, queues, and sets.
The following best practices apply to collections.

Dart 集合中原生支持了四种类型：list， map， queue， 和 set。
下面是应用于集合的最佳实践。

### DO use collection literals when possible

### **要** 尽可能的使用集合字面量

{% render 'linter-rule-mention.md', rules:'prefer_collection_literals' %}

Dart has three core collection types: List, Map, and Set. The Map and Set
classes have unnamed constructors like most classes do. But because these
collections are used so frequently, Dart has nicer built-in syntax for creating
them:

Dart 有三种核心集合类型。List、Map 和 Set，
这些类和大多数类一样，都有未命名的构造函数，
但由于这些集合使用频率很高，Dart 有更好的内置语法来创建它们：

<?code-excerpt "usage_good.dart (collection-literals)"?>
```dart tag=good
var points = <Point>[];
var addresses = <String, Address>{};
var counts = <int>{};
```

<?code-excerpt "usage_bad.dart (collection-literals)"?>
```dart tag=bad
var addresses = Map<String, Address>();
var counts = Set<int>();
```

Note that this guideline doesn't apply to the *named* constructors for those
classes. `List.from()`, `Map.fromIterable()`, and friends all have their uses.
(The List class also has an unnamed constructor, but it is prohibited in null
safe Dart.)

Collection literals are particularly powerful in Dart
because they give you access to the [spread operator][spread]
for including the contents of other collections,
and [`if` and `for`][control] for performing control flow while
building the contents:

[spread]: /language/collections#spread-operators
[control]: /language/collections#control-flow-operators

<?code-excerpt "usage_good.dart (spread-etc)"?>
```dart tag=good
var arguments = [
  ...options,
  command,
  ...?modeFlags,
  for (var path in filePaths)
    if (path.endsWith('.dart')) path.replaceAll('.dart', '.js'),
];
```

<?code-excerpt "usage_bad.dart (spread-etc)"?>
```dart tag=bad
var arguments = <String>[];
arguments.addAll(options);
arguments.add(command);
if (modeFlags != null) arguments.addAll(modeFlags);
arguments.addAll(
  filePaths
      .where((path) => path.endsWith('.dart'))
      .map((path) => path.replaceAll('.dart', '.js')),
);
```


注意，对于集合类的 *命名* 构造函数则不适用上面的规则。
`List.from()`、 `Map.fromIterable()` 都有其使用场景。 
如果需要一个固定长度的结合，使用 ``List()`` 来创建一个固定长度的 list 也是合理的。

### DON'T use `.length` to see if a collection is empty

### **不要** 使用 `.length` 来判断一个集合是否为空

{% render 'linter-rule-mention.md', rules:'prefer_is_empty, prefer_is_not_empty' %}

The [Iterable][] contract does not require that a collection know its length or
be able to provide it in constant time. Calling `.length` just to see if the
collection contains *anything* can be painfully slow.

[Iterable][] 合约并不要求集合知道其长度，也没要求在遍历的时候其长度不能改变。
通过调用 `.length`  来判断集合是否包含内容是非常低效的。

[iterable]: {{site.dart-api}}/dart-core/Iterable-class.html

Instead, there are faster and more readable getters: `.isEmpty` and
`.isNotEmpty`. Use the one that doesn't require you to negate the result.

相反，Dart 提供了更加高效率和易用的 getter 函数：`.isEmpty` 和`.isNotEmpty`。
使用这些函数并不需要对结果再次取非。

<?code-excerpt "usage_good.dart (dont-use-length)"?>
```dart tag=good
if (lunchBox.isEmpty) return 'so hungry...';
if (words.isNotEmpty) return words.join(' ');
```

<?code-excerpt "usage_bad.dart (dont-use-length)"?>
```dart tag=bad
if (lunchBox.length == 0) return 'so hungry...';
if (!words.isEmpty) return words.join(' ');
```


### AVOID using `Iterable.forEach()` with a function literal

### **避免** 在 `Iterable.forEach()` 中使用字面量函数

{% render 'linter-rule-mention.md', rules:'avoid_function_literals_in_foreach_calls' %}

`forEach()` functions are widely used in JavaScript because the built in
`for-in` loop doesn't do what you usually want. In Dart, if you want to iterate
over a sequence, the idiomatic way to do that is using a loop.

`forEach()` 函数在 JavaScript 中被广泛使用，
这因为内置的 `for-in` 循环通常不能达到你想要的效果。
在Dart中，如果要对序列进行迭代，惯用的方式是使用循环。

<?code-excerpt "usage_good.dart (avoid-for-each)"?>
```dart tag=good
for (final person in people) {
  ...
}
```

<?code-excerpt "usage_bad.dart (avoid-for-each)"?>
```dart tag=bad
people.forEach((person) {
  ...
});
```

Note that this guideline specifically says "function *literal*". If you want to
invoke some *already existing* function on each element, `forEach()` is fine.

例外情况是，如果要执行的操作是调用一些已存在的并且将每个元素作为参数的函数，
在这种情况下，`forEach()` 是很方便的。

<?code-excerpt "usage_good.dart (forEach-over-func)"?>
```dart tag=good
people.forEach(print);
```

Also note that it's always OK to use `Map.forEach()`. Maps aren't iterable, so
this guideline doesn't apply.

你可以调用 `Map.forEach()`。Map 是不可迭代的，所以该准则对它无效。

### DON'T use `List.from()` unless you intend to change the type of the result

### **不要** 使用 `List.from()` 除非想修改结果的类型

Given an Iterable, there are two obvious ways to produce a new List that
contains the same elements:

给定一个可迭代的对象，有两种常见方式来生成一个包含相同元素的 list：

<?code-excerpt "../../test/effective_dart_test.dart (list-from-1)"?>
```dart
var copy1 = iterable.toList();
var copy2 = List.from(iterable);
```

The obvious difference is that the first one is shorter. The *important*
difference is that the first one preserves the type argument of the original
object:

明显的区别是前一个更短。
更*重要*的区别在于第一个保留了原始对象的类型参数：

<?code-excerpt "../../test/effective_dart_test.dart (list-from-good)"?>
```dart tag=good
// Creates a List<int>:
var iterable = [1, 2, 3];

// Prints "List<int>":
print(iterable.toList().runtimeType);
```

<?code-excerpt "../../test/effective_dart_test.dart (list-from-bad)"?>
```dart tag=bad
// Creates a List<int>:
var iterable = [1, 2, 3];

// Prints "List<dynamic>":
print(List.from(iterable).runtimeType);
```

If you *want* to change the type, then calling `List.from()` is useful:

如果你*想要*改变类型，那么可以调用 `List.from()` ：

<?code-excerpt "../../test/effective_dart_test.dart (list-from-3)"?>
```dart tag=good
var numbers = [1, 2.3, 4]; // List<num>.
numbers.removeAt(1); // Now it only contains integers.
var ints = List<int>.from(numbers);
```

But if your goal is just to copy the iterable and preserve its original type, or
you don't care about the type, then use `toList()`.

但是如果你的目的只是复制可迭代对象并且保留元素原始类型，
或者并不在乎类型，那么请使用 `toList()`。


### DO use `whereType()` to filter a collection by type

### **要** 使用 `whereType()` 按类型过滤集合

{% render 'linter-rule-mention.md', rules:'prefer_iterable_whereType' %}

Let's say you have a list containing a mixture of objects, and you want to get
just the integers out of it. You could use `where()` like this:

假设你有一个 list 里面包含了多种类型的对象，
但是你指向从它里面获取整型类型的数据。
那么你可以像下面这样使用 `where()` ：

<?code-excerpt "usage_bad.dart (where-type)"?>
```dart tag=bad
var objects = [1, 'a', 2, 'b', 3];
var ints = objects.where((e) => e is int);
```

This is verbose, but, worse, it returns an iterable whose type probably isn't
what you want. In the example here, it returns an `Iterable<Object>` even though
you likely want an `Iterable<int>` since that's the type you're filtering it to.

这个很罗嗦，但是更糟糕的是，它返回的可迭代对象类型可能并不是你想要的。
在上面的例子中，虽然你想得到一个 `Iterable<int>`，然而它返回了一个 `Iterable<Object>`，
这是因为，这是你过滤后得到的类型。

Sometimes you see code that "corrects" the above error by adding `cast()`:

有时候你会看到通过添加 `cast()` 来“修正”上面的错误：

<?code-excerpt "usage_bad.dart (where-type-2)"?>
```dart tag=bad
var objects = [1, 'a', 2, 'b', 3];
var ints = objects.where((e) => e is int).cast<int>();
```

That's verbose and causes two wrappers to be created, with two layers of
indirection and redundant runtime checking. Fortunately, the core library has
the [`whereType()`][where-type] method for this exact use case:

代码冗长，并导致创建了两个包装器，获取元素对象要间接通过两层，并进行两次多余的运行时检查。
幸运的是，对于这个用例，核心库提供了 [`whereType()`][where-type] 方法：

[where-type]: {{site.dart-api}}/dart-core/Iterable/whereType.html

<?code-excerpt "../../test/effective_dart_test.dart (where-type)"?>
```dart tag=good
var objects = [1, 'a', 2, 'b', 3];
var ints = objects.whereType<int>();
```

Using `whereType()` is concise, produces an [Iterable][] of the desired type,
and has no unnecessary levels of wrapping.

使用 `whereType()` 简洁，
生成所需的 [Iterable][]（可迭代）类型，
并且没有不必要的层级包装。


### DON'T use `cast()` when a nearby operation will do

### **不要** 使用 `cast()`，如果有更合适的方法

Often when you're dealing with an iterable or stream, you perform several
transformations on it. At the end, you want to produce an object with a certain
type argument. Instead of tacking on a call to `cast()`, see if one of the
existing transformations can change the type.

通常，当处理可迭代对象或 stream 时，
你可以对其执行多次转换。
最后，生成所希望的具有特定类型参数的对象。
尝试查看是否有已有的转换方法来改变类型，而不是去掉用 `cast()` 。
而不是调用 `cast()`，看看是否有一个现有的转换可以改变类型。

If you're already calling `toList()`, replace that with a call to
[`List<T>.from()`][list-from] where `T` is the type of resulting list you want.

如果你已经使用了 `toList()` ，那么请使用 [`List<T>.from()`][list-from] 替换，
这里的 `T` 是你想要的返回值的类型。

[list-from]: {{site.dart-api}}/dart-core/List/List.from.html

<?code-excerpt "usage_good.dart (cast-list)"?>
```dart tag=good
var stuff = <dynamic>[1, 2];
var ints = List<int>.from(stuff);
```

<?code-excerpt "usage_bad.dart (cast-list)"?>
```dart tag=bad
var stuff = <dynamic>[1, 2];
var ints = stuff.toList().cast<int>();
```

If you are calling `map()`, give it an explicit type argument so that it
produces an iterable of the desired type. Type inference often picks the correct
type for you based on the function you pass to `map()`, but sometimes you need
to be explicit.

如果你正在调用 `map()` ，给它一个显式的类型参数，
这样它就能产生一个所需类型的可迭代对象。
类型推断通常根据传递给 `map()` 的函数选择出正确的类型，
但有的时候需要明确指明。

<?code-excerpt "usage_good.dart (cast-map)" replace="/\(n as int\)/n/g"?>
```dart tag=good
var stuff = <dynamic>[1, 2];
var reciprocals = stuff.map<double>((n) => n * 2);
```

<?code-excerpt "usage_bad.dart (cast-map)" replace="/\(n as int\)/n/g"?>
```dart tag=bad
var stuff = <dynamic>[1, 2];
var reciprocals = stuff.map((n) => n * 2).cast<double>();
```


### AVOID using `cast()`

### **避免** 使用 `cast()` 

This is the softer generalization of the previous rule. Sometimes there is no
nearby operation you can use to fix the type of some object. Even then, when
possible avoid using `cast()` to "change" a collection's type.

这是对先前规则的一个宽松的定义。
有些时候，并没有合适的方式来修改对象类型，即便如此，
也应该尽可能的避免使用 `cast()` 来“改变”集合中元素的类型。

Prefer any of these options instead:

推荐使用下面的方式来替代：

*   **Create it with the right type.** Change the code where the collection is
    first created so that it has the right type.

    **用恰当的类型创建集合。** 修改集合被首次创建时的代码，
    为集合提供有一个恰当的类型。

*   **Cast the elements on access.** If you immediately iterate over the
    collection, cast each element inside the iteration.

    **在访问元素时进行 cast 操作。** 如果要立即对集合进行迭代，
    在迭代内部 cast 每个元素。

*   **Eagerly cast using `List.from()`.** If you'll eventually access most of
    the elements in the collection, and you don't need the object to be backed
    by the original live object, convert it using `List.from()`.

    **逼不得已进行 cast，请使用 `List.from()` 。**
    如果最终你会使用到集合中的大部分元素，并且不需要对象还原到原始的对象类型，
    使用 `List.from()` 来转换它。

    The `cast()` method returns a lazy collection that checks the element type
    on *every operation*. If you perform only a few operations on only a few
    elements, that laziness can be good. But in many cases, the overhead of lazy
    validation and of wrapping outweighs the benefits.

    `cast()` 方法返回一个惰性集合 (lazy collection) ，*每个操作*都会对元素进行检查。
    如果只对少数元素执行少量操作，那么这种惰性方式就非常合适。
    但在许多情况下，惰性验证和包裹 (wrapping) 所产生的开销已经超过了它们所带来的好处。

Here is an example of **creating it with the right type:**

下面是 **用恰当的类型创建集合** 的示例：

<?code-excerpt "usage_good.dart (cast-at-create)"?>
```dart tag=good
List<int> singletonList(int value) {
  var list = <int>[];
  list.add(value);
  return list;
}
```

<?code-excerpt "usage_bad.dart (cast-at-create)"?>
```dart tag=bad
List<int> singletonList(int value) {
  var list = []; // List<dynamic>.
  list.add(value);
  return list.cast<int>();
}
```

Here is **casting each element on access:**

下面是 **在访问元素时进行 cast 操作** 的示例：

<?code-excerpt "usage_good.dart (cast-iterate)" replace="/\(n as int\)/[!$&!]/g"?>
```dart tag=good
void printEvens(List<Object> objects) {
  // We happen to know the list only contains ints.
  for (final n in objects) {
    if ([!(n as int)!].isEven) print(n);
  }
}
```

<?code-excerpt "usage_bad.dart (cast-iterate)"?>
```dart tag=bad
void printEvens(List<Object> objects) {
  // We happen to know the list only contains ints.
  for (final n in objects.cast<int>()) {
    if (n.isEven) print(n);
  }
}
```

Here is **casting eagerly using `List.from()`:**

下面是 **使用 `List.from()` 进行 cast 操作** 的示例：

<?code-excerpt "usage_good.dart (cast-from)"?>
```dart tag=good
int median(List<Object> objects) {
  // We happen to know the list only contains ints.
  var ints = List<int>.from(objects);
  ints.sort();
  return ints[ints.length ~/ 2];
}
```

<?code-excerpt "usage_bad.dart (cast-from)"?>
```dart tag=bad
int median(List<Object> objects) {
  // We happen to know the list only contains ints.
  var ints = objects.cast<int>();
  ints.sort();
  return ints[ints.length ~/ 2];
}
```

These alternatives don't always work, of course, and sometimes `cast()` is the
right answer. But consider that method a little risky and undesirable—it
can be slow and may fail at runtime if you aren't careful.

当然，这些替代方案并不总能解决问题，显然，这时候就应该选择 `cast()` 方式了。
但是考虑到这种方式的风险和缺点——如果使用不当，可能会导致执行缓慢和运行失败。


## Functions

## 函数

In Dart, even functions are objects. Here are some best practices
involving functions.

在 Dart 中，就连函数也是对象。以下是一些涉及函数的最佳实践。


### DO use a function declaration to bind a function to a name

### **要** 使用函数声明的方式为函数绑定名称

{% render 'linter-rule-mention.md', rules:'prefer_function_declarations_over_variables' %}

Modern languages have realized how useful local nested functions and closures
are. It's common to have a function defined inside another one. In many cases,
this function is used as a callback immediately and doesn't need a name. A
function expression is great for that.

现代语言已经意识到本地嵌套函数和闭包的益处。
在一个函数中定义另一个函数非常常见。
在许多情况下，这些函数被立即执行并返回结果，而且不需要名字。
这种情况下非常适合使用函数表达式来实现。

But, if you do need to give it a name, use a function declaration statement
instead of binding a lambda to a variable.

但是，如果你确实需要给方法一个名字，请使用方法定义而不是把
lambda 赋值给一个变量。

<?code-excerpt "usage_good.dart (func-decl)"?>
```dart tag=good
void main() {
  void localFunction() {
    ...
  }
}
```

<?code-excerpt "usage_bad.dart (func-decl)"?>
```dart tag=bad
void main() {
  var localFunction = () {
    ...
  };
}
```

### DON'T create a lambda when a tear-off will do

### **不要** 使用 lambda 表达式来替代 tear-off

{% render 'linter-rule-mention.md', rules:'unnecessary_lambdas' %}

When you refer to a function, method, or named constructor without parentheses,
Dart creates a _tear-off_. This is a closure that takes the same
parameters as the function and invokes the underlying function when you call it.
If your code needs a closure that invokes a named function with the same
parameters as the closure accepts, don't wrap the call in a lambda.
Use a tear-off.

如果你引用了一个函数、方法或命名构造，但省略了括号，Dart 会尝试
**tear-off**&mdash;&mdash;在调用时使用同样的参数对对应的方法创建闭包。
如果你需要的仅仅是一个引用，请不要利用 lambda 手动包装。

如果你有一个方法，这个方法调用了参数相同的另一个方法。
那么，你不需要人为将这个方法包装到一个 lambda 表达式中。

<?code-excerpt "usage_good.dart (use-tear-off)"?>
```dart tag=good
var charCodes = [68, 97, 114, 116];
var buffer = StringBuffer();

// Function:
charCodes.forEach(print);

// Method:
charCodes.forEach(buffer.write);

// Named constructor:
var strings = charCodes.map(String.fromCharCode);

// Unnamed constructor:
var buffers = charCodes.map(StringBuffer.new);
```

<?code-excerpt "usage_bad.dart (use-tear-off)"?>
```dart tag=bad
var charCodes = [68, 97, 114, 116];
var buffer = StringBuffer();

// Function:
charCodes.forEach((code) {
  print(code);
});

// Method:
charCodes.forEach((code) {
  buffer.write(code);
});

// Named constructor:
var strings = charCodes.map((code) => String.fromCharCode(code));

// Unnamed constructor:
var buffers = charCodes.map((code) => StringBuffer(code));
```

## Variables

## 变量

The following best practices describe how to best use variables in Dart.

### DO follow a consistent rule for `var` and `final` on local variables

Most local variables shouldn't have type annotations and should be declared
using just `var` or `final`. There are two rules in wide use for when to use one
or the other:

*   Use `final` for local variables that are not reassigned and `var` for those
    that are.

*   Use `var` for all local variables, even ones that aren't reassigned. Never use
    `final` for locals. (Using `final` for fields and top-level variables is
    still encouraged, of course.)

Either rule is acceptable, but pick *one* and apply it consistently throughout
your code. That way when a reader sees `var`, they know whether it means that
the variable is assigned later in the function.


### AVOID storing what you can calculate

### **避免** 保存可计算的结果

When designing a class, you often want to expose multiple views into the same
underlying state. Often you see code that calculates all of those views in the
constructor and then stores them:

在设计类的时候，你常常希望暴露底层状态的多个表现属性。
常常你会发现在类的构造函数中计算这些属性，然后保存起来：

<?code-excerpt "usage_bad.dart (calc-vs-store1)"?>
```dart tag=bad
class Circle {
  double radius;
  double area;
  double circumference;

  Circle(double radius)
    : radius = radius,
      area = pi * radius * radius,
      circumference = pi * 2.0 * radius;
}
```

This code has two things wrong with it. First, it's likely wasting memory. The
area and circumference, strictly speaking, are *caches*. They are stored
calculations that we could recalculate from other data we already have. They are
trading increased memory for reduced CPU usage. Do we know we have a performance
problem that merits that trade-off?

上面的代码有两个不妥之处。首先，这样浪费了内存。
严格来说面积和周长是*缓存*数据。
他们保存的结果可以通过已知的数据计算出来。
他们减少了 CPU 消耗却增加了内存消耗。
我们还没有权衡，到底存不存在性能问题？

Worse, the code is *wrong*. The problem with caches is *invalidation*—how
do you know when the cache is out of date and needs to be recalculated? Here, we
never do, even though `radius` is mutable. You can assign a different value and
the `area` and `circumference` will retain their previous, now incorrect values.

更糟糕的是，代码是错误的。
问题在于缓存是无效的 —— 你如何知道缓存何时会过期并且需要重新计算？
即便半径是可变的，在这里我们也永远不会这样做。
你可以赋一个不同的值，但面积和周长还是以前的值，现在的值是不正确的。

To correctly handle cache invalidation, we would need to do this:

为了正确处理缓存失效，我们需要这样做：

<?code-excerpt "usage_bad.dart (calc-vs-store2)"?>
```dart tag=bad
class Circle {
  double _radius;
  double get radius => _radius;
  set radius(double value) {
    _radius = value;
    _recalculate();
  }

  double _area = 0.0;
  double get area => _area;

  double _circumference = 0.0;
  double get circumference => _circumference;

  Circle(this._radius) {
    _recalculate();
  }

  void _recalculate() {
    _area = pi * _radius * _radius;
    _circumference = pi * 2.0 * _radius;
  }
}
```

That's an awful lot of code to write, maintain, debug, and read. Instead, your
first implementation should be:

这需要编写、维护、调试以及阅读更多的代码。
如果你一开始这样写代码：

<?code-excerpt "usage_good.dart (calc-vs-store)"?>
```dart tag=good
class Circle {
  double radius;

  Circle(this.radius);

  double get area => pi * radius * radius;
  double get circumference => pi * 2.0 * radius;
}
```

This code is shorter, uses less memory, and is less error-prone. It stores the
minimal amount of data needed to represent the circle. There are no fields to
get out of sync because there is only a single source of truth.

上面的代码更加简洁、使用更少的内存、减少出错的可能性。
它尽可能少的保存了表示圆所需要的数据。
这里没有字段需要同步，因为这里只有一个有效数据源。

In some cases, you may need to cache the result of a slow calculation, but only
do that after you know you have a performance problem, do it carefully, and
leave a comment explaining the optimization.

在某些情况下，当计算结果比较费时的时候可能需要缓存，
但是只应该在你只有你有这样的性能问题的时候再去处理，
处理时要仔细，并留下挂关于优化的注释。


## Members

## 成员

In Dart, objects have members which can be functions (methods) or data (instance
variables). The following best practices apply to an object's members.

在 Dart 中，对象成员可以是函数（方法）或数据（实例变量）。
下面是关于对象成员的最佳实践。

### DON'T wrap a field in a getter and setter unnecessarily

### **不要** 为字段创建不必要的 getter 和 setter 方法

{% render 'linter-rule-mention.md', rules:'unnecessary_getters_setters' %}

In Java and C#, it's common to hide all fields behind getters and setters (or
properties in C#), even if the implementation just forwards to the field. That
way, if you ever need to do more work in those members, you can without needing
to touch the call sites. This is because calling a getter method is different
than accessing a field in Java, and accessing a property isn't binary-compatible
with accessing a raw field in C#.

在 Java 和 C# 中，通常情况下会将所有的字段隐藏到 getter 和 setter 方法中（在 C# 中被称为属性），
即使实现中仅仅是指向这些字段。在这种方式下，即使你在这些成员上做多少的事情，你也不需要直接访问它们。
这是因为，在 Java 中，调用 getter 方法和直接访问字段是不同的。
在 C# 中，访问属性与访问字段不是二进制兼容的。

Dart doesn't have this limitation. Fields and getters/setters are completely
indistinguishable. You can expose a field in a class and later wrap it in a
getter and setter without having to touch any code that uses that field.

Dart 不存在这个限制。字段和 getter/setter 是完全无法区分的。
你可以在类中公开一个字段，然后将其包装在 getter 和 setter 中，
而不会影响任何使用该字段的代码。

<?code-excerpt "usage_good.dart (dont-wrap-field)"?>
```dart tag=good
class Box {
  Object? contents;
}
```

<?code-excerpt "usage_bad.dart (dont-wrap-field)"?>
```dart tag=bad
class Box {
  Object? _contents;
  Object? get contents => _contents;
  set contents(Object? value) {
    _contents = value;
  }
}
```


### PREFER using a `final` field to make a read-only property

### **推荐** 使用 `final` 关键字来创建只读属性

If you have a field that outside code should be able to see but not assign to, a
simple solution that works in many cases is to simply mark it `final`.

如果一个变量对于外部代码来说只能读取不能修改，
最简单的做法就是使用 `final` 关键字来标记这个变量。

<?code-excerpt "usage_good.dart (final)"?>
```dart tag=good
class Box {
  final contents = [];
}
```

<?code-excerpt "usage_bad.dart (final)"?>
```dart tag=bad
class Box {
  Object? _contents;
  Object? get contents => _contents;
}
```

Of course, if you need to internally assign to the field outside of the
constructor, you may need to do the "private field, public getter" pattern, but
don't reach for that until you need to.

当然，如果你需要构造一个内部可以赋值，外部可以访问的字段，
你可以需要这种“私有成员变量，公开访问函数”的模式，
但是，如非必要，请不要使用这种模式。


### CONSIDER using `=>` for simple members

### **考虑** 对简单成员使用 `=>` 

{% render 'linter-rule-mention.md', rules:'prefer_expression_function_bodies' %}

In addition to using `=>` for function expressions, Dart also lets you define
members with it. That style is a good fit for simple members that just calculate
and return a value.

除了使用 `=>` 可以用作函数表达式以外，
Dart 还允许使用它来定义成员。
这种风格非常适合，仅进行计算并返回结果的简单成员。

<?code-excerpt "usage_good.dart (use-arrow)"?>
```dart tag=good
double get area => (right - left) * (bottom - top);

String capitalize(String name) =>
    '${name[0].toUpperCase()}${name.substring(1)}';
```

People *writing* code seem to love `=>`, but it's very easy to abuse it and end
up with code that's hard to *read*. If your declaration is more than a couple of
lines or contains deeply nested expressions—cascades and conditional
operators are common offenders—do yourself and everyone who has to read
your code a favor and use a block body and some statements.

*编写*代码的人似乎很喜欢 `=>` 语法，但是它很容易被滥用，最后导致代码不容易被*阅读*。
如果你有很多行声明或包含深层的嵌套表达式（级联和条件运算符就是常见的罪魁祸首），
你以及其他人有谁会愿意读这样的代码！
你应该换做使用代码块和一些语句来实现。

<?code-excerpt "usage_good.dart (arrow-long)"?>
```dart tag=good
Treasure? openChest(Chest chest, Point where) {
  if (_opened.containsKey(chest)) return null;

  var treasure = Treasure(where);
  treasure.addAll(chest.contents);
  _opened[chest] = treasure;
  return treasure;
}
```

<?code-excerpt "usage_bad.dart (arrow-long)"?>
```dart tag=bad
Treasure? openChest(Chest chest, Point where) => _opened.containsKey(chest)
    ? null
    : _opened[chest] = (Treasure(where)..addAll(chest.contents));
```

You can also use `=>` on members that don't return a value. This is idiomatic
when a setter is small and has a corresponding getter that uses `=>`.

你还可以对不返回值的成员使用 `=>` 。 
这里有个惯例，就是当 setter 和 getter 都比较简单的时候使用 `=>` 。

<?code-excerpt "usage_good.dart (arrow-setter)"?>
```dart tag=good
num get x => center.x;
set x(num value) => center = Point(value, center.y);
```


### DON'T use `this.` except to redirect to a named constructor or to avoid shadowing {:#dont-use-this-when-not-needed-to-avoid-shadowing}

### **不要** 使用 `this.`，在重定向命名函数和避免冲突的情况下除外

{% render 'linter-rule-mention.md', rules:'unnecessary_this' %}

JavaScript requires an explicit `this.` to refer to members on the object whose
method is currently being executed, but Dart—like C++, Java, and
C#—doesn't have that limitation.

JavaScript 需要使用 `this.` 来引用对象的成员变量，
但是 Dart&mdash;和 C++, Java, 以及C#&mdash;没有这种限制。

There are only two times you need to use `this.`. One is when a local variable
with the same name shadows the member you want to access:

只有当局部变量和成员变量名字一样的时候，你才需要使用 `this.` 来访问成员变量。
只有两种情况需要使用 `this.`，
其中一种情况是要访问的局部变量和成员变量命名一样的时候：

<?code-excerpt "usage_bad.dart (this-dot)"?>
```dart tag=bad
class Box {
  Object? value;

  void clear() {
    this.update(null);
  }

  void update(Object? value) {
    this.value = value;
  }
}
```

<?code-excerpt "usage_good.dart (this-dot)"?>
```dart tag=good
class Box {
  Object? value;

  void clear() {
    update(null);
  }

  void update(Object? value) {
    this.value = value;
  }
}
```

The other time to use `this.` is when redirecting to a named constructor:

另一种使用 `this.` 的情况是在重定向到一个命名函数的时候：

<?code-excerpt "usage_bad.dart (this-dot-constructor)"?>
```dart tag=bad
class ShadeOfGray {
  final int brightness;

  ShadeOfGray(int val) : brightness = val;

  ShadeOfGray.black() : this(0);

  // This won't parse or compile!
  // ShadeOfGray.alsoBlack() : black();
}
```

<?code-excerpt "usage_good.dart (this-dot-constructor)"?>
```dart tag=good
class ShadeOfGray {
  final int brightness;

  ShadeOfGray(int val) : brightness = val;

  ShadeOfGray.black() : this(0);

  // But now it will!
  ShadeOfGray.alsoBlack() : this.black();
}
```

Note that constructor parameters never shadow fields in constructor initializer
lists:

注意，构造函数初始化列表中的字段有永远不会与构造函数参数列表参数产生冲突。

<?code-excerpt "usage_good.dart (param-dont-shadow-field-ctr-init)"?>
```dart tag=good
class Box extends BaseBox {
  Object? value;

  Box(Object? value) : value = value, super(value);
}
```

This looks surprising, but works like you want. Fortunately, code like this is
relatively rare thanks to initializing formals and super initializers.

这看起来很令人惊讶，但是实际结果是你想要的。
幸运的是，由于初始化规则的特殊性，上面的代码很少见到。


### DO initialize fields at their declaration when possible

### **要** 尽可能的在定义变量的时候初始化变量值

If a field doesn't depend on any constructor parameters, it can and should be
initialized at its declaration. It takes less code and avoids duplication when
the class has multiple constructors.

<?code-excerpt "usage_bad.dart (field-init-at-decl)"?>
```dart tag=bad
class ProfileMark {
  final String name;
  final DateTime start;

  ProfileMark(this.name) : start = DateTime.now();
  ProfileMark.unnamed() : name = '', start = DateTime.now();
}
```

<?code-excerpt "usage_good.dart (field-init-at-decl)"?>
```dart tag=good
class ProfileMark {
  final String name;
  final DateTime start = DateTime.now();

  ProfileMark(this.name);
  ProfileMark.unnamed() : name = '';
}
```

Some fields can't be initialized at their declarations because they need to reference
`this`—to use other fields or call methods, for example. However, if the
field is marked `late`, then the initializer *can* access `this`.

Of course, if a field depends on constructor parameters, or is initialized
differently by different constructors, then this guideline does not apply.

当然，对于变量取值依赖构造函数参数的情况以及不同的构造函数取值也不一样的情况，
则不适合本条规则。


## Constructors

## 构造函数

The following best practices apply to declaring constructors for a class.

下面对于类的构造函数的最佳实践。

### DO use initializing formals when possible

### **要** 尽可能的使用初始化形式

{% render 'linter-rule-mention.md', rules:'prefer_initializing_formals' %}

Many fields are initialized directly from a constructor parameter, like:

许多字段直接使用构造函数参数来初始化，如：

<?code-excerpt "usage_bad.dart (field-init-as-param)"?>
```dart tag=bad
class Point {
  double x, y;
  Point(double x, double y) : x = x, y = y;
}
```

We've got to type `x` _four_ times here to define a field. We can do better:

为了初始化一个字段，我们需要反复写下 `x` **四**次。
使用下面的方式会更好：

<?code-excerpt "usage_good.dart (field-init-as-param)"?>
```dart tag=good
class Point {
  double x, y;
  Point(this.x, this.y);
}
```

This `this.` syntax before a constructor parameter is called an "initializing
formal". You can't always take advantage of it. Sometimes you want to have a
named parameter whose name doesn't match the name of the field you are
initializing. But when you *can* use initializing formals, you *should*.


### DON'T use `late` when a constructor initializer list will do

Dart requires you to initialize non-nullable fields before they can be read.
Since fields can be read inside the constructor body, 
this means you get an error if you don't initialize a
non-nullable field before the body runs.

Dart 要求你为非空变量在它们被访问前就初始化好内容。
如果你没有初始化，那么在构造函数运行时就会直接报错。

You can make this error go away by marking the field `late`. That turns the
compile-time error into a *runtime* error if you access the field before it is
initialized. That's what you need in some cases, but often the right fix is to
initialize the field in the constructor initializer list:

如果构造函数参数使用 `this.` 的方式来初始化字段，
这时参数的类型被认为和字段类型相同。

<?code-excerpt "usage_good.dart (late-init-list)"?>
```dart tag=good
class Point {
  double x, y;
  Point.polar(double theta, double radius)
    : x = cos(theta) * radius,
      y = sin(theta) * radius;
}
```

<?code-excerpt "usage_bad.dart (late-init-list)"?>
```dart tag=bad
class Point {
  late double x, y;
  Point.polar(double theta, double radius) {
    x = cos(theta) * radius;
    y = sin(theta) * radius;
  }
}
```


The initializer list gives you access to constructor parameters and lets you
initialize fields before they can be read. So, if it's possible to use an initializer list,
that's better than making the field `late` and losing some static safety and
performance.


### DO use `;` instead of `{}` for empty constructor bodies

### **要** 用 `;` 来替代空的构造函数体 `{}`

{% render 'linter-rule-mention.md', rules:'empty_constructor_bodies' %}

In Dart, a constructor with an empty body can be terminated with just a
semicolon. (In fact, it's required for const constructors.)

在 Dart 中，没有具体函数体的构造函数可以使用分号结尾。
（事实上，这是不可变构造函数的要求。）

<?code-excerpt "usage_good.dart (semicolon-for-empty-body)"?>
```dart tag=good
class Point {
  double x, y;
  Point(this.x, this.y);
}
```

<?code-excerpt "usage_bad.dart (semicolon-for-empty-body)"?>
```dart tag=bad
class Point {
  double x, y;
  Point(this.x, this.y) {}
}
```

### DON'T use `new`

### **不要** 使用 `new`

{% render 'linter-rule-mention.md', rules:'unnecessary_new' %}

The `new` keyword is optional when calling a constructor.
Its meaning is not clear because factory constructors mean a
`new` invocation may not actually return a new object.

Dart 2 `new` 关键字成为可选项。
即使在Dart 1中，其含义也从未明确过，
因为在工厂构造函数中，调用 `new` 可能并不意味着一定会返回一个新对象。

The language still permits `new`, but consider
it deprecated and avoid using it in your code.

Dart 语言仍然允许使用 `new` 关键字，
但请考虑在你的代码中弃用和避免使用 `new`。

<?code-excerpt "usage_good.dart (no-new)"?>
```dart tag=good
Widget build(BuildContext context) {
  return Row(
    children: [
      RaisedButton(child: Text('Increment')),
      Text('Click!'),
    ],
  );
}
```

<?code-excerpt "usage_bad.dart (no-new)" replace="/new/[!$&!]/g"?>
```dart tag=bad
Widget build(BuildContext context) {
  return [!new!] Row(
    children: [
      [!new!] RaisedButton(child: [!new!] Text('Increment')),
      [!new!] Text('Click!'),
    ],
  );
}
```


### DON'T use `const` redundantly

### **不要** 冗余地使用 `const` 

{% render 'linter-rule-mention.md', rules:'unnecessary_const' %}

In contexts where an expression *must* be constant, the `const` keyword is
implicit, doesn't need to be written, and shouldn't. Those contexts are any
expression inside:

在表达式一定是常量的上下文中，`const` 关键字是隐式的，不需要写，也不应该。
这里包括：

* A const collection literal.

  一个字面量常量集合。

* A const constructor call

  调用一个常量构造函数。

* A metadata annotation.

  元数据注解。

* The initializer for a const variable declaration.

  一个常量声明的初始化方法。

* A switch case expression—the part right after `case` before the `:`, not
  the body of the case.

  switch case 表达式—— `case` 和 `:` 中间的部分，不是 case 执行体。


(Default values are not included in this list because future versions of Dart
may support non-const default values.)

（默认值并不包含在这个列表中，因为在 Dart 将来的版本中可能会在支持非常量的默认值。）

Basically, any place where it would be an error to write `new` instead of
`const`, Dart allows you to omit the `const`.

基本上，任何地方用 `new` 替代 `const` 的写法都是错的，
因为 Dart 2 中允许省略 `const` 。

<?code-excerpt "usage_good.dart (no-const)"?>
```dart tag=good
const primaryColors = [
  Color('red', [255, 0, 0]),
  Color('green', [0, 255, 0]),
  Color('blue', [0, 0, 255]),
];
```

<?code-excerpt "usage_bad.dart (no-const)" replace="/ (const)/ [!$1!]/g"?>
```dart tag=bad
const primaryColors = [!const!] [
  [!const!] Color('red', [!const!] [255, 0, 0]),
  [!const!] Color('green', [!const!] [0, 255, 0]),
  [!const!] Color('blue', [!const!] [0, 0, 255]),
];
```

## Error handling

## 错误处理

Dart uses exceptions when an error occurs in your program. The following
best practices apply to catching and throwing exceptions.

Dart 使用异常来表示程序执行错误。
下面是关于如何捕获和抛出异常的最佳实践。

### AVOID catches without `on` clauses

### **避免** 使用没有 `on` 语句的 catch

{% render 'linter-rule-mention.md', rules:'avoid_catches_without_on_clauses' %}

A catch clause with no `on` qualifier catches *anything* thrown by the code in
the try block. [Pokémon exception handling][pokemon] is very likely not what you
want. Does your code correctly handle [StackOverflowError][] or
[OutOfMemoryError][]? If you incorrectly pass the wrong argument to a method in
that try block do you want to have your debugger point you to the mistake or
would you rather that helpful [ArgumentError][] get swallowed? Do you want any
`assert()` statements inside that code to effectively vanish since you're
catching the thrown [AssertionError][]s?

没有 `on` 限定的 catch 语句会捕获 try 代码块中抛出的*任何*异常。
[Pokémon exception handling][pokemon] 可能并不是你想要的。
你的代码是否正确的处理 [StackOverflowError][] 或者 [OutOfMemoryError][] 异常？
如果你使用错误的参数调用函数，你是期望调试器定位出你的错误使用情况还是，
把这个有用的 [ArgumentError][] 给吞噬了？
由于你捕获了 [AssertionError][] 异常，
导致所有 try 块内的 `assert()` 语句都失效了，这是你需要的结果吗？

The answer is probably "no", in which case you should filter the types you
catch. In most cases, you should have an `on` clause that limits you to the
kinds of runtime failures you are aware of and are correctly handling.

答案和可能是 "no"，在这种情况下，你应该过滤掉捕获的类型。
在大多数情况下，你应该有一个 `on` 子句，
这样它能够捕获程序在运行时你所关注的限定类型的异常并进行恰当处理。

In rare cases, you may wish to catch any runtime error. This is usually in
framework or low-level code that tries to insulate arbitrary application code
from causing problems. Even here, it is usually better to catch [Exception][]
than to catch all types. Exception is the base class for all *runtime* errors
and excludes errors that indicate *programmatic* bugs in the code.


### DON'T discard errors from catches without `on` clauses

### **不要** 丢弃没有使用 `on` 语句捕获的异常

If you really do feel you need to catch *everything* that can be thrown from a
region of code, *do something* with what you catch. Log it, display it to the
user or rethrow it, but do not silently discard it.

如果你真的期望捕获一段代码内的 *所有* 异常，
请*在捕获异常的地方做些事情*。 记录下来并显示给用户，
或者重新抛出 (rethrow) 异常信息，记得不要默默的丢弃该异常信息。


### DO throw objects that implement `Error` only for programmatic errors

### **要** 只在代表编程错误的情况下才抛出实现了 `Error` 的异常

The [Error][] class is the base class for *programmatic* errors. When an object
of that type or one of its subinterfaces like [ArgumentError][] is thrown, it
means there is a *bug* in your code. When your API wants to report to a caller
that it is being used incorrectly throwing an Error sends that signal clearly.

[Error][] 类是所有 *编码* 错误的基类。当一个该类型或者其子类型，
例如 [ArgumentError][] 对象被抛出了，这意味着是你代码中的一个 *bug*。
当你的 API 想要告诉调用者使用错误的时候可以抛出一个 Error 来表明你的意图。


Conversely, if the exception is some kind of runtime failure that doesn't
indicate a bug in the code, then throwing an Error is misleading. Instead, throw
one of the core Exception classes or some other type.

同样的，如果一个异常表示为运行时异常而不是代码 bug， 则抛出 Error 则会误导调用者。
应该抛出核心定义的 Exception 类或者其他类型。


### DON'T explicitly catch `Error` or types that implement it

### **不要** 显示的捕获 `Error` 或者其子类

{% render 'linter-rule-mention.md', rules:'avoid_catching_errors' %}

This follows from the above. Since an Error indicates a bug in your code, it
should unwind the entire callstack, halt the program, and print a stack trace so
you can locate and fix the bug.

本条衔接上一条的内容。既然 Error 表示代码中的 bug，
应该展开整个调用堆栈，暂停程序并打印堆栈跟踪，以便找到错误并修复。

Catching errors of these types breaks that process and masks the bug. Instead of
*adding* error-handling code to deal with this exception after the fact, go back
and fix the code that is causing it to be thrown in the first place.

捕获这类错误打破了处理流程并且代码中有 bug。
不要在这里使用错误处理代码，而是需要到导致该错误出现的地方修复你的代码。


### DO use `rethrow` to rethrow a caught exception

### **要** 使用 `rethrow` 来重新抛出捕获的异常

{% render 'linter-rule-mention.md', rules:'use_rethrow_when_possible' %}

If you decide to rethrow an exception, prefer using the `rethrow` statement
instead of throwing the same exception object using `throw`.
`rethrow` preserves the original stack trace of the exception. `throw` on the
other hand resets the stack trace to the last thrown position.

如果你想重新抛出一个异常，推荐使用 `rethrow` 语句。
`rethrow` 保留了原来的异常堆栈信息。 
而 `throw` 会把异常堆栈信息重置为最后抛出的位置。

<?code-excerpt "usage_bad.dart (rethrow)"?>
```dart tag=bad
try {
  somethingRisky();
} catch (e) {
  if (!canHandle(e)) throw e;
  handle(e);
}
```

<?code-excerpt "usage_good.dart (rethrow)" replace="/rethrow/[!$&!]/g"?>
```dart tag=good
try {
  somethingRisky();
} catch (e) {
  if (!canHandle(e)) [!rethrow!];
  handle(e);
}
```


## Asynchrony

## 异步

Dart has several language features to support asynchronous programming.
The following best practices apply to asynchronous coding.

Dart 具有几个语言特性来支持异步编程。
下面是针对异步编程的最佳实践。

### PREFER async/await over using raw futures

### **推荐** 使用 async/await 而不是直接使用底层的特性

Asynchronous code is notoriously hard to read and debug, even when using a nice
abstraction like futures. The `async`/`await` syntax improves readability and
lets you use all of the Dart control flow structures within your async code.

显式的异步代码是非常难以阅读和调试的，
即使使用很好的抽象（比如 future）也是如此。
这就是为何 Dart 提供了 `async`/`await`。
这样可以显著的提高代码的可读性并且让你可以在异步代码中使用语言提供的所有流程控制语句。

<?code-excerpt "usage_good.dart (async-await)" replace="/async|await/[!$&!]/g"?>
```dart tag=good
Future<int> countActivePlayers(String teamName) [!async!] {
  try {
    var team = [!await!] downloadTeam(teamName);
    if (team == null) return 0;

    var players = [!await!] team.roster;
    return players.where((player) => player.isActive).length;
  } on DownloadException catch (e, _) {
    log.error(e);
    return 0;
  }
}
```

<?code-excerpt "usage_bad.dart (async-await)"?>
```dart tag=bad
Future<int> countActivePlayers(String teamName) {
  return downloadTeam(teamName)
      .then((team) {
        if (team == null) return Future.value(0);

        return team.roster.then((players) {
          return players.where((player) => player.isActive).length;
        });
      })
      .onError<DownloadException>((e, _) {
        log.error(e);
        return 0;
      });
}
```

### DON'T use `async` when it has no useful effect

### **不要** 在没有有用效果的情况下使用 `async` 

It's easy to get in the habit of using `async` on any function that does
anything related to asynchrony. But in some cases, it's extraneous. If you can
omit the `async` without changing the behavior of the function, do so.

当成为习惯之后，你可能会在所有和异步相关的函数使用 `async`。但是在有些情况下，
如果可以忽略 `async`  而不改变方法的行为，则应该这么做：

<?code-excerpt "usage_good.dart (unnecessary-async)"?>
```dart tag=good
Future<int> fastestBranch(Future<int> left, Future<int> right) {
  return Future.any([left, right]);
}
```

<?code-excerpt "usage_bad.dart (unnecessary-async)"?>
```dart tag=bad
Future<int> fastestBranch(Future<int> left, Future<int> right) async {
  return Future.any([left, right]);
}
```

Cases where `async` *is* useful include:

下面这些情况 `async` 是有用的：

* You are using `await`. (This is the obvious one.)

  你使用了 `await`。 (这是一个很明显的例子。)

* You are returning an error asynchronously. `async` and then `throw` is shorter
  than `return Future.error(...)`.

  你在异步的抛出一个异常。 `async` 然后 `throw` 比 `return new Future.error(...)` 要简短很多。

* You are returning a value and you want it implicitly wrapped in a future.
  `async` is shorter than `Future.value(...)`.

  你在返回一个值，但是你希望他显式的使用 Future。`async` 比 `Future.value(...)` 要简短很多。

<?code-excerpt "usage_good.dart (async)"?>
```dart tag=good
Future<void> usesAwait(Future<String> later) async {
  print(await later);
}

Future<void> asyncError() async {
  throw 'Error!';
}

Future<String> asyncValue() async => 'value';
```

### CONSIDER using higher-order methods to transform a stream

### **考虑** 使用高阶函数来转换事件流 (stream) 

This parallels the above suggestion on iterables. Streams support many of the
same methods and also handle things like transmitting errors, closing, etc.
correctly.

### AVOID using Completer directly

### **避免** 直接使用 Completer

Many people new to asynchronous programming want to write code that produces a
future. The constructors in Future don't seem to fit their need so they
eventually find the Completer class and use that.

很多异步编程的新手想要编写生成一个 future 的代码。
而 Future 的构造函数看起来并不满足他们的要求，
然后他们就发现 Completer 类并使用它：

<?code-excerpt "usage_bad.dart (avoid-completer)"?>
```dart tag=bad
Future<bool> fileContainsBear(String path) {
  var completer = Completer<bool>();

  File(path).readAsString().then((contents) {
    completer.complete(contents.contains('bear'));
  });

  return completer.future;
}
```

Completer is needed for two kinds of low-level code: new asynchronous
primitives, and interfacing with asynchronous code that doesn't use futures.
Most other code should use async/await or [`Future.then()`][then], because
they're clearer and make error handling easier.

Completer 是用于两种底层代码的：
新的异步原子操作和集成没有使用 Future 的异步代码。
大部分的代码都应该使用 async/await 或者 [`Future.then()`][then]，
这样代码更加清晰并且异常处理更加容易。

[then]: {{site.dart-api}}/dart-async/Future/then.html

<?code-excerpt "usage_good.dart (avoid-completer)"?>
```dart tag=good
Future<bool> fileContainsBear(String path) {
  return File(path).readAsString().then((contents) {
    return contents.contains('bear');
  });
}
```

<?code-excerpt "usage_good.dart (avoid-completer-alt)"?>
```dart tag=good
Future<bool> fileContainsBear(String path) async {
  var contents = await File(path).readAsString();
  return contents.contains('bear');
}
```


### DO test for `Future<T>` when disambiguating a `FutureOr<T>` whose type argument could be `Object`

### **要** 使用 `Future<T>` 对 `FutureOr<T>` 参数进行测试，以消除参数可能是 `Object` 类型的歧义

Before you can do anything useful with a `FutureOr<T>`, you typically need to do
an `is` check to see if you have a `Future<T>` or a bare `T`. If the type
argument is some specific type as in `FutureOr<int>`, it doesn't matter which
test you use, `is int` or `is Future<int>`. Either works because those two types
are disjoint.

在使用 `FutureOr<T>` 执行任何有用的操作之前，
通常需要做 `is` 检查，来确定你拥有的是 `Future<T>` 还是一个空的 `T`。
如果类型参数是某个特定类型，如 `FutureOr <int>`，
使用 `is int` 或 `is Future<int>` 那种测试都可以。
两者都有效，因为这两种类型是不相交的。

However, if the value type is `Object` or a type parameter that could possibly
be instantiated with `Object`, then the two branches overlap. `Future<Object>`
itself implements `Object`, so `is Object` or `is T` where `T` is some type
parameter that could be instantiated with `Object` returns true even when the
object is a future. Instead, explicitly test for the `Future` case:

但是，如果值的类型是 `Object` 或者可能使用 `Object` 实例化的类型参数，这时要分两种情况。
`Future<Object>` 本身继承 `Object` ，使用 `is Object` 或 `is T` ，
其中 `T` 表示参数的类型，该参数可能是 `Object` 的实例，
在这种情况下，即使是 future 对象也会返回 true 。
相反，下面是确切测试 `Future` 的例子：

<?code-excerpt "usage_good.dart (test-future-or)"?>
```dart tag=good
Future<T> logValue<T>(FutureOr<T> value) async {
  if (value is Future<T>) {
    var result = await value;
    print(result);
    return result;
  } else {
    print(value);
    return value;
  }
}
```

<?code-excerpt "usage_bad.dart (test-future-or)"?>
```dart tag=bad
Future<T> logValue<T>(FutureOr<T> value) async {
  if (value is T) {
    print(value);
    return value;
  } else {
    var result = await value;
    print(result);
    return result;
  }
}
```

In the bad example, if you pass it a `Future<Object>`, it incorrectly treats it
like a bare, synchronous value.

在错误的示例中，如果给它传一个 `Future<Object>` ，
它会错误地将其视为一个空的同步对象值。

[pokemon]: https://blog.codinghorror.com/new-programming-jargon/
[Error]: {{site.dart-api}}/dart-core/Error-class.html
[StackOverflowError]: {{site.dart-api}}/dart-core/StackOverflowError-class.html
[OutOfMemoryError]: {{site.dart-api}}/dart-core/OutOfMemoryError-class.html
[ArgumentError]: {{site.dart-api}}/dart-core/ArgumentError-class.html
[AssertionError]: {{site.dart-api}}/dart-core/AssertionError-class.html
[Exception]: {{site.dart-api}}/dart-core/Exception-class.html
