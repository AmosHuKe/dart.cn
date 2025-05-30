---
# title: "Effective Dart: Documentation"
title: 高效 Dart 语言指南：文档
# description: Clear, helpful comments and documentation.
description: 简洁实用的注释以及文档。
nextpage:
  url: /effective-dart/usage
  # title: Usage
  title: 用法示例
prevpage:
  url: /effective-dart/style
  # title: Style
  title: 代码风格
---

<?code-excerpt path-base="misc/lib/effective_dart"?>

It's easy to think your code is obvious today without realizing how much you
rely on context already in your head. People new to your code, and
even your forgetful future self won't have that context. A concise, accurate
comment only takes a few seconds to write but can save one of those people
hours of time.

你可能没有意识到，今天你很容易想出来的代码，有多么依赖你当时思路。
人们不熟悉你的代码，甚至你也忘记了当时代码功能中有这样的思路。
写下简明扼要的注释只需要几秒钟，但可以让看这段代码的每个人节约几个小时。

We all know code should be self-documenting and not all comments are helpful.
But the reality is that most of us don't write as many comments as we should.
It's like exercise: you technically *can* do too much, but it's a lot more
likely that you're doing too little. Try to step it up.

我们知道代码应该自文档（self-documenting），并不是所有的注释都是有用的。
但实际情况是，我们大多数人都没有写出尽可能多的注释。
和练习一样：从技术上你*可以*做很多，但是实际上你
只做了一点点。尝试着逐步提高。

## Comments

## 注释

The following tips apply to comments that you don't want included in the
generated documentation.

下面的提示适用于不被生成在文档中的注释。

### DO format comments like sentences

### **要** 像句子一样来格式化注释。

<?code-excerpt "docs_good.dart (comments-like-sentences)"?>
```dart tag=good
// Not if anything comes before it.
if (_chunks.isNotEmpty) return false;
```

Capitalize the first word unless it's a case-sensitive identifier. End it with a
period (or "!" or "?", I suppose). This is true for all comments: doc comments,
inline stuff, even TODOs. Even if it's a sentence fragment.

如果第一个单词不是大小写相关的标识符，则首字母要大写。
使用句号，叹号或者问号结尾。所有的注释都应该这样：
文档注释，单行注释，甚至 TODO。即使它是一个句子的片段。

### DON'T use block comments for documentation

### **不要** 使用块注释作用作解释说明。

<?code-excerpt "docs_good.dart (block-comments)"?>
```dart tag=good
void greet(String name) {
  // Assume we have a valid name.
  print('Hi, $name!');
}
```

<?code-excerpt "docs_bad.dart (block-comments)"?>
```dart tag=bad
void greet(String name) {
  /* Assume we have a valid name. */
  print('Hi, $name!');
}
```

You can use a block comment (`/* ... */`) to temporarily comment out a section
of code, but all other comments should use `//`.

可以使用块注释 (`/* ... */`) 来临时的注释掉一段代码，
但是其他的所有注释都应该使用 `//`。

## Doc comments

## 文档注释

Doc comments are especially handy because [`dart doc`][] parses them
and generates [beautiful doc pages][docs] from them.
A doc comment is any comment that appears before a declaration
and uses the special `///` syntax that `dart doc` looks for.

文档注释特别有用，应为通过 [`dart doc`][] 解析这些注释可以生成 [漂亮的文档网页][docs]。
文档注释包括所有出现在声明之前并使用 `///` 语法的注释，这些注释使用使用 dartdoc 检索。

[`dart doc`]: /tools/dart-doc
[docs]: {{site.dart-api}}

### DO use `///` doc comments to document members and types

### **要** 使用 `///` 文档注释来注释成员和类型。

{% render 'linter-rule-mention.md', rules:'slash_for_doc_comments' %}

Using a doc comment instead of a regular comment enables 
[`dart doc`][] to find it
and generate documentation for it.

使用文档注释可以让 [`dart doc`][] 来为你生成代码 API 文档。

<?code-excerpt "docs_good.dart (use-doc-comments)"?>
```dart tag=good
/// The number of characters in this chunk when unsplit.
int get length => ...
```

<?code-excerpt "docs_good.dart (use-doc-comments)" replace="/^\///g"?>
```dart tag=bad
// The number of characters in this chunk when unsplit.
int get length => ...
```

For historical reasons, `dart doc` supports two syntaxes of doc comments: `///`
("C# style") and `/** ... */` ("JavaDoc style"). We prefer `///` because it's
more compact. `/**` and `*/` add two content-free lines to a multiline doc
comment. The `///` syntax is also easier to read in some situations, such as
when a doc comment contains a bulleted list that uses `*` to mark list items.

由于历史原因，dartdoc 支持两种格式的文档注释：`///` ("C# 格式") 和 `/** ... */` ("JavaDoc 格式")。
我们推荐使用 `///` 是因为其更加简洁。
`/**` 和 `*/` 在多行注释中间添加了开头和结尾的两行多余内容。
`///` 在一些情况下也更加易于阅读，例如，当文档注释中包含有使用 `*` 标记的列表内容的时候。

If you stumble onto code that still uses the JavaDoc style, consider cleaning it
up.

如果你现在还在使用 JavaDoc 风格格式，请考虑使用新的格式。

### PREFER writing doc comments for public APIs

### **推荐** 为公开发布的 API 编写文档注释。

{% render 'linter-rule-mention.md', rules:'public_member_api_docs' %}

You don't have to document every single library, top-level variable, type, and
member, but you should document most of them.

不必为所有独立的库，顶级变量，类型以及成员编写文档注释。
但是它们大多数应该有文档注释。

### CONSIDER writing a library-level doc comment

### **考虑** 编写库级别（library-level）的文档注释。

Unlike languages like Java where the class is the only unit of program
organization, in Dart, a library is itself an entity that users work with
directly, import, and think about. That makes the `library` directive a great
place for documentation that introduces the reader to the main concepts and
functionality provided within. Consider including:

与Java等类似的语言不同，Java 中类是程序组织的唯一单元。
在 Dart 中，库本身就是一个实体，用户可以直接使用，导入及构思它。
这使得`库`成为一个展示文档的好地方。
这样可以向读者介绍其中提供的主要概念和功能。
其中可以考虑包括下列内容：

* A single-sentence summary of what the library is for.

  关于库用途的单句摘要。

* Explanations of terminology used throughout the library.
  
  解释库中用到的术语。

* A couple of complete code samples that walk through using the API.

  一些配合 API 的示例代码。

* Links to the most important or most commonly used classes and functions.

  最重要和最常用的类和函数的链接。

* Links to external references on the domain the library is concerned with.

  和库相关领域的外部链接。

To document a library, place a doc comment before
the `library` directive and any annotations that might be attached
at the start of the file.

若要给某个库生成文档，你需要在 `library`
和任何可能会放置在文件开头的注释之前，
加入文档注释。

<?code-excerpt "docs_good.dart (library-doc)"?>
```dart tag=good
/// A really great test library.
@TestOn('browser')
library;
```


### CONSIDER writing doc comments for private APIs

### **推荐** 为私有API 编写文档注释。

Doc comments aren't just for external consumers of your library's public API.
They can also be helpful for understanding private members that are called from
other parts of the library.

文档注释不仅仅适用于外部用户使用你库的公开 API.
它也同样有助于理解那些私有成员，这些私有成员会被库的其他部分调用。

### DO start doc comments with a single-sentence summary

### **要** 要在文档注释开头有一个单句总结。

Start your doc comment with a brief, user-centric description ending with a
period. A sentence fragment is often sufficient. Provide just enough context for
the reader to orient themselves and decide if they should keep reading or look
elsewhere for the solution to their problem.

注释文档要以一个以用户为中心，简要的描述作为开始。
通常句子片段就足够了。为读者提供足够的上下文来定位自己，
并决定是否应该继续阅读，或寻找其他解决问题的方法。

<?code-excerpt "docs_good.dart (first-sentence)"?>
```dart tag=good
/// Deletes the file at [path] from the file system.
void delete(String path) {
  ...
}
```

<?code-excerpt "docs_bad.dart (first-sentence)"?>
```dart tag=bad
/// Depending on the state of the file system and the user's permissions,
/// certain operations may or may not be possible. If there is no file at
/// [path] or it can't be accessed, this function throws either [IOError]
/// or [PermissionError], respectively. Otherwise, this deletes the file.
void delete(String path) {
  ...
}
```

### DO separate the first sentence of a doc comment into its own paragraph

### **要** 让文档注释的第一句从段落中分开。 

Add a blank line after the first sentence to split it out into its own
paragraph. If more than a single sentence of explanation is useful, put the
rest in later paragraphs.

在第一句之后添加一个空行，将其拆分为自己的段落。 
如果不止一个解释句子有用，请将其余部分放在后面的段落中。

This helps you write a tight first sentence that summarizes the documentation.
Also, tools like `dart doc` use the first paragraph as a short summary in places
like lists of classes and members.

这有助于你编写一个紧凑的第一句话来总结文档。 
此外，像Dartdoc这样的工具使用第一段作为类和类成员列表等地方的简短摘要。

<?code-excerpt "docs_good.dart (first-sentence-a-paragraph)"?>
```dart tag=good
/// Deletes the file at [path].
///
/// Throws an [IOError] if the file could not be found. Throws a
/// [PermissionError] if the file is present but could not be deleted.
void delete(String path) {
  ...
}
```

<?code-excerpt "docs_bad.dart (first-sentence-a-paragraph)"?>
```dart tag=bad
/// Deletes the file at [path]. Throws an [IOError] if the file could not
/// be found. Throws a [PermissionError] if the file is present but could
/// not be deleted.
void delete(String path) {
  ...
}
```

### AVOID redundancy with the surrounding context

### **避免** 与周围上下文冗余。

The reader of a class's doc comment can clearly see the name of the class, what
interfaces it implements, etc. When reading docs for a member, the signature is
right there, and the enclosing class is obvious. None of that needs to be
spelled out in the doc comment. Instead, focus on explaining what the reader
*doesn't* already know.

阅读类的文档注释的可以清楚地看到类的名称，它实现的接口等等。
当读取成员的文档时，命名和封装它的类是显而易见的。 
这些都不需要写在文档注释中。 
相反，应该专注于解释读者所*不知道*的内容。

<?code-excerpt "docs_good.dart (redundant)"?>
```dart tag=good
class RadioButtonWidget extends Widget {
  /// Sets the tooltip to [lines].
  ///
  /// The lines should be word wrapped using the current font.
  void tooltip(List<String> lines) {
    ...
  }
}
```

<?code-excerpt "docs_bad.dart (redundant)"?>
```dart tag=bad
class RadioButtonWidget extends Widget {
  /// Sets the tooltip for this radio button widget to the list of strings in
  /// [lines].
  void tooltip(List<String> lines) {
    ...
  }
}
```

If you really don't have anything interesting to say
that can't be inferred from the declaration itself,
then omit the doc comment.
It's better to say nothing
than waste a reader's time telling them something they already know.

<a id="prefer-starting-function-or-method-comments-with-third-person-verbs" aria-hidden="true"></a>

### PREFER starting comments of a function or method with third-person verbs if its main purpose is a side effect

### **推荐** 用第三人称来开始函数或者方法的文档注释（如果主要目的是副作用）。

The doc comment should focus on what the code *does*.

注释应该关注于代码 *所实现的* 功能。

<?code-excerpt "docs_good.dart (third-person)"?>
```dart tag=good
/// Connects to the server and fetches the query results.
Stream<QueryResult> fetchResults(Query query) => ...

/// Starts the stopwatch if not already running.
void start() => ...
```

### PREFER starting a non-boolean variable or property comment with a noun phrase

### **推荐** 使用名词短语来为非布尔值变量或属性注释。

The doc comment should stress what the property *is*. This is true even for
getters which may do calculation or other work. What the caller cares about is
the *result* of that work, not the work itself.

注释文档应该表述这个属性*是*什么。虽然 getter 函数会做些计算，
但是也要求这样，调用者关心的是其*结果*而不是如何计算的。

<?code-excerpt "docs_good.dart (noun-phrases-for-non-boolean-var-etc)"?>
```dart tag=good
/// The current day of the week, where `0` is Sunday.
int weekday;

/// The number of checked buttons on the page.
int get checkedCount => ...
```

### PREFER starting a boolean variable or property comment with "Whether" followed by a noun or gerund phrase

The doc comment should clarify the states this variable represents.
This is true even for getters which may do calculation or other work.
What the caller cares about is the *result* of that work, not the work itself.

<?code-excerpt "docs_good.dart (noun-phrases-for-boolean-var-etc)"?>
```dart tag=good
/// Whether the modal is currently displayed to the user.
bool isVisible;

/// Whether the modal should confirm the user's intent on navigation.
bool get shouldConfirm => ...

/// Whether resizing the current browser window will also resize the modal.
bool get canResize => ...
```

:::note
This guideline intentionally doesn't include using "Whether or not". In many
cases, usage of "or not" with "whether" is superfluous and can be omitted,
especially when used in this context.
:::

### PREFER a noun phrase or non-imperative verb phrase for a function or method if returning a value is its primary purpose

If a method is *syntactically* a method, but *conceptually* it is a property,
and is therefore [named with a noun phrase or non-imperative verb phrase][parameterized_property_name],
it should also be documented as such.
Use a noun-phrase for such non-boolean functions, and
a phrase starting with "Whether" for such boolean functions,
just as for a syntactic property or variable.

<?code-excerpt "docs_good.dart (noun-for-func-returning-value)"?>
```dart tag=good
/// The [index]th element of this iterable in iteration order.
E elementAt(int index);

/// Whether this iterable contains an element equal to [element].
bool contains(Object? element);
```

:::note
This guideline should be applied based on whether the declaration is
conceptually seen as a property.

Sometimes a method has no side effects, and might
conceptually be seen as a property, but is still
simpler to name with a verb phrase like `list.take()`.
Then a noun phrase should still be used to document it.
_For example `Iterable.take` can be described as
"The first \[count\] elements of ..."._
:::

[parameterized_property_name]: design#prefer-a-noun-phrase-or-non-imperative-verb-phrase-for-a-function-or-method-if-returning-a-value-is-its-primary-purpose

### DON'T write documentation for both the getter and setter of a property

### **不要** 同时为属性的 getter 和 setter 编写文档

If a property has both a getter and a setter, then create a doc comment for
only one of them. `dart doc` treats the getter and setter like a single field,
and if both the getter and the setter have doc comments, then
`dart doc` discards the setter's doc comment.

如果一个属性同时包含 getter 和 setter，请只为其中一个添加文档。
`dart doc` 命令会将 getter 和 setter 作为同一个属性进行处理，
而如果它们都包含文档注释，`dart docs` 命令会将 setter 的文档忽略。

<?code-excerpt "docs_good.dart (getter-and-setter)"?>
```dart tag=good
/// The pH level of the water in the pool.
///
/// Ranges from 0-14, representing acidic to basic, with 7 being neutral.
int get phLevel => ...
set phLevel(int level) => ...
```

<?code-excerpt "docs_bad.dart (getter-and-setter)"?>
```dart tag=bad
/// The depth of the water in the pool, in meters.
int get waterDepth => ...

/// Updates the water depth to a total of [meters] in height.
set waterDepth(int meters) => ...
```

### PREFER starting library or type comments with noun phrases

### **推荐** 使用名词短语来开始库和类型注释。

Doc comments for classes are often the most important documentation in your
program. They describe the type's invariants, establish the terminology it uses,
and provide context to the other doc comments for the class's members. A little
extra effort here can make all of the other members simpler to document.

在程序中，类的注释通常是最重要的文档。
类的注释描述了类型的不变性、介绍其使用的术语、
提供类成员使用的上下文信息。为类提供一些注释可以让
其他类成员的注释更易于理解和编写。

The documentation should describe an *instance* of the type.

该文档注释应当描述该类型的 *实例*。

<?code-excerpt "docs_good.dart (noun-phrases-for-type-or-lib)"?>
```dart tag=good
/// A chunk of non-breaking output text terminated by a hard or soft newline.
///
/// ...
class Chunk {
   ...
}
```

### CONSIDER including code samples in doc comments

### **考虑** 在文档注释中添加示例代码。

<?code-excerpt "docs_good.dart (code-sample)"?>
````dart tag=good
/// The lesser of two numbers.
///
/// ```dart
/// min(5, 3) == 3
/// ```
num min(num a, num b) => ...
````

Humans are great at generalizing from examples, so even a single code sample
makes an API easier to learn.

人类非常擅长从示例中抽象出实质内容，所以即使提供
一行最简单的示例代码都可以让 API 更易于理解。

### DO use square brackets in doc comments to refer to in-scope identifiers

### **要** 使用方括号在文档注释中引用作用域内的标识符

{% render 'linter-rule-mention.md', rules:'comment_references' %}

If you surround things like variable, method, or type names in square brackets,
then `dart doc` looks up the name and links to the relevant API docs.
Parentheses are optional but can
clarify you're referring to a function or constructor.
The following partial doc comments illustrate a few cases
where these comment references can be helpful:

如果给变量，方法，或类型等名称加上方括号，则 dartdoc 会查找名称并链接到相关的 API 文档。
括号是可选的，但是当你在引用一个方法或者构造函数时，可以让注释更清晰。
下面的文档注释说明了这些注释引用可能有帮助的几种情况：

<?code-excerpt "docs_good.dart (identifiers)"?>
```dart tag=good
/// Throws a [StateError] if ...
///
/// Similar to [anotherMethod()], but ...
```

To link to a member of a specific class, use the class name and member name,
separated by a dot:

要链接到特定类的成员，请使用以点号分割的类名和成员名：

<?code-excerpt "docs_good.dart (member)"?>
```dart tag=good
/// Similar to [Duration.inDays], but handles fractional days.
```

The dot syntax can also be used to refer to named constructors. For the unnamed
constructor, use `.new` after the class name:

点语法也可用于引用命名构造函数。
对于未命名的构造函数，在类名后面加上 `.new` 来使用默认构造：

<?code-excerpt "docs_good.dart (ctor)"?>
```dart tag=good
/// To create a point, call [Point.new] or use [Point.polar] to ...
```

To learn more about the references that
the analyzer and `dart doc` support in doc comments,
check out [Documentation comment references][].

[Documentation comment references]: /tools/doc-comments/references

### DO use prose to explain parameters, return values, and exceptions

### **要** 使用平白简单的语句来描述参数、返回值以及异常信息。

Other languages use verbose tags and sections to describe what the parameters
and returns of a method are.

其他语言使用各种标签和额外的注释来描述参数和返回值。

<?code-excerpt "docs_bad.dart (no-annotations)"?>
```dart tag=bad
/// Defines a flag with the given name and abbreviation.
///
/// @param name The name of the flag.
/// @param abbr The abbreviation for the flag.
/// @returns The new flag.
/// @throws ArgumentError If there is already an option with
///     the given name or abbreviation.
Flag addFlag(String name, String abbreviation) => ...
```

The convention in Dart is to integrate that into the description of the method
and highlight parameters using square brackets.

Dart 的惯例是将其整合到方法的描述中，使用方括号高亮并标记参数。

Consider having sections starting with "The \[parameter\]" to describe
parameters, with "Returns" for the returned value and "Throws" for exceptions.
Errors can be documented the same way as exceptions,
or just as requirements that must be satisfied, without documenting the
precise error which will be thrown.

可以考虑以“The \[参数\]”开头来分块描述参数，
使用 "Returns" 说明返回值，并用 "Throws" 描述异常信息。
对于错误 (Errors)，可以采用与异常 (exceptions) 相同的文档方式，
也可以仅将其作为必须满足的条件进行说明，而无需具体记录将会抛出的精确错误类型。

<?code-excerpt "docs_good.dart (no-annotations)"?>
```dart tag=good
/// Defines a flag with the given [name] and [abbreviation].
///
/// The [name] and [abbreviation] strings must not be empty.
///
/// Returns a new flag.
///
/// Throws a [DuplicateFlagException] if there is already an option named
/// [name] or there is already an option using the [abbreviation].
Flag addFlag(String name, String abbreviation) => ...
```

### DO put doc comments before metadata annotations

### **要** 把注释文档放到注解之前。

<?code-excerpt "docs_good.dart (doc-before-meta)"?>
```dart tag=good
/// A button that can be flipped on and off.
@Component(selector: 'toggle')
class ToggleComponent {}
```

<?code-excerpt "docs_bad.dart (doc-before-meta)" replace="/\n\n/\n/g"?>
```dart tag=bad
@Component(selector: 'toggle')
/// A button that can be flipped on and off.
class ToggleComponent {}
```

## Markdown

You are allowed to use most [markdown][] formatting in your doc comments and
`dart doc` will process it accordingly using the [markdown package.][]

文档注释中允许使用大多数 [markdown][] 格式，
并且 dartdoc 会根据 [markdown package.][] 进行解析。

[markdown]: https://daringfireball.net/projects/markdown/
[markdown package.]: {{site.pub-pkg}}/markdown

There are tons of guides out there already to introduce you to Markdown. Its
universal popularity is why we chose it. Here's just a quick example to give you
a flavor of what's supported:

有很多指南已经向你介绍Markdown。 它普遍受欢迎是我们选择它的原因。 这里只是一个简单的例子，让你了解所支持的内容：

<?code-excerpt "docs_good.dart (markdown)"?>
````dart
/// This is a paragraph of regular text.
///
/// This sentence has *two* _emphasized_ words (italics) and **two**
/// __strong__ ones (bold).
///
/// A blank line creates a separate paragraph. It has some `inline code`
/// delimited using backticks.
///
/// * Unordered lists.
/// * Look like ASCII bullet lists.
/// * You can also use `-` or `+`.
///
/// 1. Numbered lists.
/// 2. Are, well, numbered.
/// 1. But the values don't matter.
///
///     * You can nest lists too.
///     * They must be indented at least 4 spaces.
///     * (Well, 5 including the space after `///`.)
///
/// Code blocks are fenced in triple backticks:
///
/// ```dart
/// this.code
///     .will
///     .retain(its, formatting);
/// ```
///
/// The code language (for syntax highlighting) defaults to Dart. You can
/// specify it by putting the name of the language after the opening backticks:
///
/// ```html
/// <h1>HTML is magical!</h1>
/// ```
///
/// Links can be:
///
/// * https://www.just-a-bare-url.com
/// * [with the URL inline](https://google.com)
/// * [or separated out][ref link]
///
/// [ref link]: https://google.com
///
/// # A Header
///
/// ## A subheader
///
/// ### A subsubheader
///
/// #### If you need this many levels of headers, you're doing it wrong
````

### AVOID using markdown excessively

### **避免** 过度使用 markdown。

When in doubt, format less. Formatting exists to illuminate your content, not
replace it. Words are what matter.

如果有格式缺少的问题，格式化已有的内容来阐明你的想法，而不是替换它，
内容才是最重要的。

### AVOID using HTML for formatting

### **避免** 使用 HTML 来格式化文字。

It *may* be useful to use it in rare cases for things like tables, but in almost
all cases, if it's too complex to express in Markdown, you're better off not
expressing it.

例如表格，在极少数情况下它*可能*很有用。
但几乎所有的情况下，在 Markdown 中表格的表示都非常复杂。
这种情况下最好不要使用表格。

### PREFER backtick fences for code blocks

### **推荐** 使用反引号标注代码。

Markdown has two ways to indicate a block of code: indenting the code four
spaces on each line, or surrounding it in a pair of triple-backtick "fence"
lines. The former syntax is brittle when used inside things like Markdown lists
where indentation is already meaningful or when the code block itself contains
indented code.

Markdown 有两种方式来标注一块代码：
每行代码缩进4个空格，或者在代码上下各标注三个反引号。
当缩进已经包含其他意义，或者代码段自身就包含缩进时，
在 Markdown 中使用前一种语法就显得很脆弱。

The backtick syntax avoids those indentation woes, lets you indicate the code's
language, and is consistent with using backticks for inline code.

反引号语法避免了那些缩进的问题，
而且能够指出代码的语言类型，
内联代码同样可以使用反引号标注。

```dart tag=good
/// You can use [CodeBlockExample] like this:
///
/// ```dart
/// var example = CodeBlockExample();
/// print(example.isItGreat); // "Yes."
/// ```
```

```dart tag=bad
/// You can use [CodeBlockExample] like this:
///
///     var example = CodeBlockExample();
///     print(example.isItGreat); // "Yes."
```

## Writing

## 如何写注释

We think of ourselves as programmers, but most of the characters in a source
file are intended primarily for humans to read. English is the language we code
in to modify the brains of our coworkers. As for any programming language, it's
worth putting effort into improving your proficiency.

虽然我们认为我们是程序员，但是大部分情况下源代码中的内容都是为了让人类更易于阅读和理解代码。
对于任何编程语言，都值得努力练习来提高熟练程度。

This section lists a few guidelines for our docs. You can learn more about
best practices for technical writing, in general, from articles such as
[Technical writing style](https://en.wikiversity.org/wiki/Technical_writing_style).

### PREFER brevity

### **推荐** 简洁.

Be clear and precise, but also terse.

要清晰和准确，并且简洁。

### AVOID abbreviations and acronyms unless they are obvious

### **避免** 缩写和首字母缩写词，除非很常见。

Many people don't know what "i.e.", "e.g." and "et al." mean. That acronym
that you're sure everyone in your field knows may not be as widely known as you
think.

很多人都不知道 "i.e."、 "e.g." 和 "et. al." 的意思。
你所在领域的首字母缩略词对于其他人可能并不了解。

### PREFER using "this" instead of "the" to refer to a member's instance

### **推荐** 使用 "this" 而不是 "the" 来引用实例成员。

When documenting a member for a class, you often need to refer back to the
object the member is being called on. Using "the" can be ambiguous.
Prefer having some qualifier after "this", a sole "this" can be ambiguous too.

注释中提及到类的成员，通常是指被调用的对象实例的成员。
使用 "the" 可能会导致混淆。
最好在 "this" 后面加上一些限定词，单独的 "this" 也会产生歧义。

<?code-excerpt "docs_good.dart (this)"?>
```dart
class Box {
  /// The value this box wraps.
  Object? _value;

  /// Whether this box contains a value.
  bool get hasValue => _value != null;
}
```
