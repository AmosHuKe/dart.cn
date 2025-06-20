---
# title: The Dart type system
title: Dart 语言里的类型体系
# description: Why and how to write sound Dart code.
description: 如何写出优雅的 Dart 代码。
prevpage:
  url: /language/typedefs
  # title: Typedefs
  title: 类型别名
nextpage:
  url: /language/patterns
  # title: Patterns
  title: 模式匹配
---
<?code-excerpt replace="/ *\/\/\s+ignore_for_file:[^\n]+\n//g; /([A-Z]\w*)\d\b/$1/g; /\b(main)\d\b/$1/g; /(^|\n) *\/\/\s+ignore:[^\n]+\n/$1/g; /(\n[^\n]+) *\/\/\s+ignore:[^\n]+\n/$1\n/g"?>
<?code-excerpt path-base="type_system"?>

The Dart language is type safe: it uses a combination of static type checking
and [runtime checks](#runtime-checks) to
ensure that a variable's value always matches the variable's static type,
sometimes referred to as sound typing.
Although _types_ are mandatory, type _annotations_ are optional
because of [type inference](#type-inference).

Dart 是类型安全的编程语言：Dart 使用静态类型检查和
[运行时检查](#runtime-checks)
的组合来确保变量的值始终与变量的静态类型或其他安全类型相匹配。尽管类型是必需的，但由于
[类型推断](#type-inference)，类型的注释是可选的。

One benefit of static type checking is the ability to find bugs
at compile time using Dart's [static analyzer.][analysis]

静态类型检查的一个好处是能够使用 Dart 的
[静态分析器][analysis] 在编译时找到错误。

You can fix most static analysis errors by adding type annotations to generic
classes. The most common generic classes are the collection types
`List<T>` and `Map<K,V>`.

可以向泛型类添加类型注释来修复大多数静态分析错误。
最常见的泛型类是集合类型 `List<T>` 和 `Map<K,V>` 。

For example, in the following code the `printInts()` function prints an integer list,
and `main()` creates a list and passes it to `printInts()`.

例如，在下面的代码中，`main()` 创建一个列表并将其传递给 `printInts()`，
由 `printInts()` 函数打印这个整数列表。

<?code-excerpt "lib/strong_analysis.dart (opening-example)" replace="/list(?=\))/[!$&!]/g"?>
```dart tag=fails-sa
void printInts(List<int> a) => print(a);

void main() {
  final list = [];
  list.add(1);
  list.add('2');
  printInts([!list!]);
}
```

The preceding code results in a type error on `list` (highlighted
above) at the call of `printInts(list)`:

上面的代码在调用 `printInts(list)` 时会在 `list` （高亮提示）上产生类型错误：

<?code-excerpt "analyzer-results-stable.txt" retain="/strong_analysis.*List.*argument_type_not_assignable/" replace="/-(.*?):(.*?):(.*?)-/-/g; /. • (lib|test)\/\w+\.dart:\d+:\d+//g"?>
```plaintext
error - The argument type 'List<dynamic>' can't be assigned to the parameter type 'List<int>'. - argument_type_not_assignable
```

The error highlights an unsound implicit cast from `List<dynamic>` to `List<int>`.
The `list` variable has static type `List<dynamic>`. This is because the
initializing declaration `var list = []` doesn't provide the analyzer with
enough information for it to infer a type argument more specific than `dynamic`.
The `printInts()` function expects a parameter of type `List<int>`,
causing a mismatch of types.

高亮错误是因为产生了从 `List<dynamic>` 到 `List<int>` 的不正确的隐式转换。
`list` 变量是 `List<dynamic>` 静态类型。这是因为 `list` 变量的初始化声明 `var list = []`
没有为分析器提供足够的信息来推断比 `dynamic` 更具体的类型参数。
`printInts()` 函数需要 `List<int>` 类型的参数，因此导致类型不匹配。

When adding a type annotation (`<int>`) on creation of the list
(highlighted below) the analyzer complains that
a string argument can't be assigned to an `int` parameter. 
Removing the quotes in `list.add('2')` results in code
that passes static analysis and runs with no errors or warnings.

在创建 `list` 时添加类型注释 `<int>`（代码中高亮显示部分）后，分析器会提示无法将字符串参数分配给 `int` 参数。
删除 `list.add("2")` 中的字符串引号使代码通过静态分析并能够正常执行。

<?code-excerpt "test/strong_test.dart (opening-example)" replace="/<int.(?=\[)|2/[!$&!]/g"?>
```dart tag=passes-sa
void printInts(List<int> a) => print(a);

void main() {
  final list = [!<int>!][];
  list.add(1);
  list.add([!2!]);
  printInts(list);
}
```

[Try it in DartPad]({{site.dartpad}}/?id=25074a51a00c71b4b000f33b688dedd0).

[尝试在 DartPad 中练习]({{site.dartpad}}/f64e963cb5f894e2146c2b28d5efa4ed).

## What is soundness?

## 什么是类型安全

*Soundness* is about ensuring your program can't get into certain
invalid states. A sound *type system* means you can never get into
a state where an expression evaluates to a value that doesn't match
the expression's static type. For example, if an expression's static
type is `String`, at runtime you are guaranteed to only get a string
when you evaluate it.

类型安全是为了确保程序不会进入某些无效状态。
安全的类型系统意味着程序永远不会进入表达式求值为与表达式的静态类型不匹配的值的状态。
例如，如果表达式的静态类型是 `String` ，则在运行时保证在评估它的时候只会获取字符串。

Dart's type system, like the type systems in Java and C#, is sound. It
enforces that soundness using a combination of static checking
(compile-time errors) and runtime checks. For example, assigning a `String`
to `int` is a compile-time error. Casting an object to a `String` using
`as String` fails with a runtime error if the object isn't a `String`.

Dart 的类型系统，同 Java 和 C＃ 中的类型系统类似，是安全的。
它使用静态检查（编译时错误）和运行时检查的组合来强制执行类型安全。
例如，将 `String` 分配给 `int` 是一个编译时错误。如果`对象`不是字符串，
使用 `as String` 将`对象`转换为字符串时，会由于运行时错误而导致转换失败。


## The benefits of soundness

## 类型安全的好处

A sound type system has several benefits:

安全的类型系统有以下几个好处：

* Revealing type-related bugs at compile time.<br>
  A sound type system forces code to be unambiguous about its types,
  so type-related bugs that might be tricky to find at runtime are
  revealed at compile time.

  在编译时就可以检查并显示类型相关的错误。<br>
  安全的类型系统强制要求代码明确类型，
  因此在编译时会显示与类型相关的错误，
  这些错误可能在运行时可能很难发现。

* More readable code.<br>
  Code is easier to read because you can rely on a value actually having
  the specified type. In sound Dart, types can't lie.

  代码更容易阅读。<br>
  代码更容易阅读，因为我们信赖一个拥有指定类型的值。
  在类型安全的 Dart 中，类型是不会骗人的。 因为一个拥有指定类型的值是可以被信赖的。

* More maintainable code.<br>
  With a sound type system, when you change one piece of code, the
  type system can warn you about the other pieces
  of code that just broke.

  代码可维护性更高。<br>
  在安全的类型系统下，当更改一处代码后，
  类型系统会警告因此影响到的其他代码块。

* Better ahead of time (AOT) compilation.<br>
  While AOT compilation is possible without types, the generated
  code is much less efficient.

  更好的 AOT 编译。<br>
  虽然在没有类型的情况下可以进行 AOT 编译，
  但生成的代码效率要低很多。


## Tips for passing static analysis

## 静态检查中的一些技巧

Most of the rules for static types are easy to understand.
Here are some of the less obvious rules:

大多数静态类型的规则都很容易理解。
下面是一些不太明显的规则：

* Use sound return types when overriding methods.

  重写方法时，使用类型安全返回值。

* Use sound parameter types when overriding methods.

  重写方法时，使用类型安全的参数。

* Don't use a dynamic list as a typed list.

  不要将动态类型的 List 看做是有类型的 List。

Let's see these rules in detail, with examples that use the following
type hierarchy:

让我们通过下面示例的类型结构，来更深入的了解这些规则：

<img src="/assets/img/language/type-hierarchy.png" class="diagram-wrap" alt="a hierarchy of animals where the supertype is Animal and the subtypes are Alligator, Cat, and HoneyBadger. Cat has the subtypes of Lion and MaineCoon">

<a name="use-proper-return-types"></a>
### Use sound return types when overriding methods

### 重写方法时，使用类型安全的返回值

The return type of a method in a subclass must be the same type or a
subtype of the return type of the method in the superclass. 
Consider the getter method in the `Animal` class:

子类方法中返回值类型必须与父类方法中返回值类型的类型相同或其子类型。
考虑 Animal 类中的 Getter 方法：

<?code-excerpt "lib/animal.dart (Animal)" replace="/Animal get.*/[!$&!]/g"?>
```dart
class Animal {
  void chase(Animal a) {
     ...
  }
  [!Animal get parent => ...!]
}
```

The `parent` getter method returns an `Animal`. In the `HoneyBadger` subclass,
you can replace the getter's return type with `HoneyBadger` 
(or any other subtype of `Animal`), but an unrelated type is not allowed.

`父类` Getter 方法返回一个 Animal 。在 HoneyBadger 子类中，
可以使用 HoneyBadger（或 Animal 的任何其他子类型）替换 Getter 的返回值类型，
但不允许使用其他的无关类型。

<?code-excerpt "lib/animal.dart (HoneyBadger)" replace="/(\w+)(?= get)/[!$&!]/g"?>
```dart tag=passes-sa
class HoneyBadger extends Animal {
  @override
  void chase(Animal a) {
     ...
  }

  @override
  [!HoneyBadger!] get parent => ...
}
```

<?code-excerpt "lib/animal.dart (HoneyBadger)" replace="/HoneyBadger get/[!Root!] get/g"?>
```dart tag=fails-sa
class HoneyBadger extends Animal {
  @override
  void chase(Animal a) {
     ...
  }

  @override
  [!Root!] get parent => ...
}
```

<a name="use-proper-param-types"></a>
### Use sound parameter types when overriding methods

### 重写方法时，使用类型安全的参数。

The parameter of an overridden method must have either the same type
or a supertype of the corresponding parameter in the superclass.
Don't "tighten" the parameter type by replacing the type with a
subtype of the original parameter.

子类方法的参数必须与父类方法中参数的类型相同或是其参数的父类型。
不要使用原始参数的子类型，替换原有类型，这样会导致参数类型"收紧"。

:::note

If you have a valid reason to use a subtype, you can use the
[`covariant` keyword](/language/type-system#covariant-keyword).

如果有合理的理由使用子类型，
可以使用 [`covariant` 关键字](/language/type-system#covariant-keyword)。

:::

Consider the `chase(Animal)` method for the `Animal` class:

考虑 Animal 的 `chase(Animal)` 方法：

<?code-excerpt "lib/animal.dart (Animal)" replace="/void chase.*/[!$&!]/g"?>
```dart
class Animal {
  [!void chase(Animal a) {!]
     ...
  }
  Animal get parent => ...
}
```

The `chase()` method takes an `Animal`. A `HoneyBadger` chases anything.
It's OK to override the `chase()` method to take anything (`Object`).

`chase()` 方法的参数类型是 Animal 。一个 HoneyBadger 可以追逐任何东西。
因此可以在重写 `chase()` 方法时将参数类型指定为任意类型  (Object)  。

<?code-excerpt "lib/animal.dart (chase-Object)" replace="/Object/[!$&!]/g"?>
```dart tag=passes-sa
class HoneyBadger extends Animal {
  @override
  void chase([!Object!] a) {
     ...
  }

  @override
  Animal get parent => ...
}
```

The following code tightens the parameter on the `chase()` method
from `Animal` to `Mouse`, a subclass of `Animal`.

Mouse 是 Animal 的子类，下面的代码将 `chase()`
方法中参数的范围从 Animal 缩小到 Mouse 。

<?code-excerpt "lib/incorrect_animal.dart (chase-mouse)" replace="/Mouse/[!$&!]/g"?>
```dart tag=fails-sa
class [!Mouse!] extends Animal {
   ...
}

class Cat extends Animal {
  @override
  void chase([!Mouse!] a) {
     ...
  }
}
```

This code is not type safe because it would then be possible to define
a cat and send it after an alligator:

下面的代码不是类型安全的，因为 a 可以是一个 cat 对象，
却可以给它传入一个 alligator 对象。

<?code-excerpt "lib/incorrect_animal.dart (would-not-be-type-safe)" replace="/Alligator/[!$&!]/g"?>
```dart
Animal a = Cat();
a.chase([!Alligator!]()); // Not type safe or feline safe.
```

### Don't use a dynamic list as a typed list

### 不要将动态类型的 List 看做是有类型的 List 

A `dynamic` list is good when you want to have a list with
different kinds of things in it. However, you can't use a
`dynamic` list as a typed list.

当期望在一个 List 中可以包含不同类型的对象时，动态列表是很好的选择。
但是不能将动态类型的 List 看做是有类型的 List 。

This rule also applies to instances of generic types.

这个规则也适用于泛型类型的实例。

The following code creates a `dynamic` list of `Dog`, and assigns it to
a list of type `Cat`, which generates an error during static analysis.

下面代码创建一个 `Dog` 的动态 List ，并将其分配给 `Cat` 类型的 List ，
表达式在静态分析期间会产生错误。

<?code-excerpt "lib/incorrect_animal.dart (invalid-dynamic-list)" replace="/(<dynamic\x3E)(.*?)Error/[!$1!]$2Error/g"?>
```dart tag=fails-sa
void main() {
  List<Cat> foo = [!<dynamic>!][Dog()]; // Error
  List<dynamic> bar = <dynamic>[Dog(), Cat()]; // OK
}
```

## Runtime checks

## 运行时检查

Runtime checks deal with type safety issues
that can't be detected at compile time.

运行时检查工具会处理分析器无法捕获的类型安全问题。

For example, the following code throws an exception at runtime
because it's an error to cast a list of dogs to a list of cats:

例如，以下代码在运行时会抛出异常，
因为将 Dog 类型的 List 赋值给 Cat 类型的 List 是错误的：

<?code-excerpt "test/strong_test.dart (runtime-checks)" replace="/animals as[^;]*/[!$&!]/g"?>
```dart tag=runtime-fail
void main() {
  List<Animal> animals = <Dog>[Dog()];
  List<Cat> cats = [!animals as List<Cat>!];
}
```

### Implicit downcasts from `dynamic`

Expressions with a static type of `dynamic` can be
implicitly cast to a more specific type.
If the actual type doesn't match, the cast throws an error at run time.
Consider the following `assumeString` method:

<?code-excerpt "lib/strong_analysis.dart (downcast-check)" replace="/string = object/[!$&!]/g"?>
```dart tag=passes-sa
int assumeString(dynamic object) {
  String [!string = object!]; // Check at run time that `object` is a `String`.
  return string.length;
}
```

In this example, if `object` is a `String`, the cast succeeds.
If it's not a subtype of `String`, such as `int`,
a `TypeError` is thrown:

<?code-excerpt "lib/strong_analysis.dart (fail-downcast-check)" replace="/1/[!$&!]/g"?>
```dart tag=runtime-fail
final length = assumeString([!1!]);
```

:::tip
To prevent implicit downcasts from `dynamic` and avoid this issue,
consider enabling the analyzer's _strict casts_ mode.

```yaml title="analysis_options.yaml" highlightLines=3
analyzer:
  language:
    strict-casts: true
```

To learn more about customizing the analyzer's behavior,
check out [Customizing static analysis](/tools/analysis).
:::

## Type inference

## 类型推断

The analyzer can infer types for fields, methods, local variables,
and most generic type arguments.
When the analyzer doesn't have enough information to infer
a specific type, it uses the `dynamic` type.

分析器 (analyzer) 可以推断字段，方法，局部变量和大多数泛型类型参数的类型。
当分析器没有足够的信息来推断出一个特定类型时，会使用 `dynamic` 作为类型。

Here's an example of how type inference works with generics.
In this example, a variable named `arguments` holds a map that
pairs string keys with values of various types.

下面是在泛型中如何进行类型推断的示例。在此示例中，名为 `arguments` 的变量包含一个 Map ，
该 Map 将字符串键与各种类型的值配对。

If you explicitly type the variable, you might write this:

如果显式键入变量，则可以这样写：

<?code-excerpt "lib/strong_analysis.dart (type-inference-1-orig)" replace="/Map<String, Object\?\x3E/[!$&!]/g"?>
```dart
[!Map<String, Object?>!] arguments = {'argA': 'hello', 'argB': 42};
```

Alternatively, you can use `var` or `final` and let Dart infer the type:

或者，使用 `var` 让 Dart 来推断类型：

<?code-excerpt "lib/strong_analysis.dart (type-inference-1)" replace="/var/[!$&!]/g"?>
```dart
[!var!] arguments = {'argA': 'hello', 'argB': 42}; // Map<String, Object>
```

The map literal infers its type from its entries,
and then the variable infers its type from the map literal's type.
In this map, the keys are both strings, but the values have different
types (`String` and `int`, which have the upper bound `Object`).
So the map literal has the type `Map<String, Object>`,
and so does the `arguments` variable.

Map 字面量从其条目中推断出它的类型，然后变量从 Map 字面量的类型中推断出它的类型。
在此 Map 中，键都是字符串，但值具有不同的类型（ String 和 int ，它们具有共同的上限类型 Object ）。
因此，Map 字面量的类型为 `Map<String, Object>` ，也就是 `arguments` 的类型。

### Field and method inference

### 字段和方法推断

A field or method that has no specified type and that overrides
a field or method from the superclass, inherits the type of the
superclass method or field.

重写父类的且没有指定类型的字段或方法，继承父类中字段或方法的类型。

A field that does not have a declared or inherited type but that is declared
with an initial value, gets an inferred type based on the initial value.

没有声明类型且不存在继承类型的字段，如果在声明时被初始化，
那么字段的类型为初始化值的类型。

### Static field inference

### 静态字段推断

Static fields and variables get their types inferred from their
initializer. Note that inference fails if it encounters a cycle
(that is, inferring a type for the variable depends on knowing the
type of that variable).

静态字段和变量的类型从其初始化程序中推断获得。 
需要注意的是，如果推断是个循环，推断会失败
（也就是说，推断变量的类型取决于知道该变量的类型）。

### Local variable inference

### 局部变量推断

Local variable types are inferred from their initializer, if any.
Subsequent assignments are not taken into account.
This may mean that too precise a type may be inferred.
If so, you can add a type annotation.

在不考虑连续赋值的情况下，局部变量如果有初始化值的情况下，其类型是从初始化值推断出来的。
这可能意味着推断出来的类型会非常严格。
如果是这样，可以为他们添加类型注释。

<?code-excerpt "lib/strong_analysis.dart (local-var-type-inference-error)"?>
```dart tag=fails-sa
var x = 3; // x is inferred as an int.
x = 4.0;
```

<?code-excerpt "lib/strong_analysis.dart (local-var-type-inference-ok)"?>
```dart tag=passes-sa
num y = 3; // A num can be double or int.
y = 4.0;
```

### Type argument inference

### 参数类型推断

Type arguments to constructor calls and
[generic method](/language/generics#using-generic-methods) invocations
are inferred based on a combination of downward information from the context
of occurrence, and upward information from the arguments to the constructor
or generic method. If inference is not doing what you want or expect,
you can always explicitly specify the type arguments.

构造函数调用的类型参数和 [泛型方法](/language/generics#using-generic-methods)
调用是根据上下文的向下信息和构造函数或泛型方法的参数的向上信息组合推断的。
如果推断没有按照意愿或期望进行，那么你可以显式的指定他们的参数类型。

<?code-excerpt "lib/strong_analysis.dart (type-arg-inference)"?>
```dart tag=passes-sa
// Inferred as if you wrote <int>[].
List<int> listOfInt = [];

// Inferred as if you wrote <double>[3.0].
var listOfDouble = [3.0];

// Inferred as Iterable<int>.
var ints = listOfDouble.map((x) => x.toInt());
```

In the last example, `x` is inferred as `double` using downward information.
The return type of the closure is inferred as `int` using upward information.
Dart uses this return type as upward information when inferring the `map()`
method's type argument: `<int>`.

在最后一个示例中，根据向下信息 `x` 被推断为 `double` 。 闭包的返回类型根据向上信息推断为 `int` 。
在推断 `map()` 方法的类型参数：`<int>` 时，Dart 使用此返回值的类型作为向上信息。

#### Inference using bounds

:::version-note
Inference using bounds requires a [language version][] of at least 3.7.0.
:::

With the inference using bounds feature,
Dart's type inference algorithm generates constraints by
combining existing constraints with the declared type bounds,
not just best-effort approximations.

This is especially important for [F-bounded][] types,
where inference using bounds correctly infers that, in the example below,
`X` can be bound to `B`.
Without the feature, the type argument must be specified explicitly: `f<B>(C())`:

<?code-excerpt "lib/strong_analysis.dart (inference-using-bounds)"?>
```dart
class A<X extends A<X>> {}

class B extends A<B> {}

class C extends B {}

void f<X extends A<X>>(X x) {}

void main() {
  f(B()); // OK.

  // OK. Without using bounds, inference relying on best-effort approximations
  // would fail after detecting that `C` is not a subtype of `A<C>`.
  f(C());

  f<B>(C()); // OK.
}
```

Here's a more realistic example using everyday types in Dart like `int` or `num`:

<?code-excerpt "lib/bounded/instantiate_to_bound.dart (inference-using-bounds-2)"?>
```dart
X max<X extends Comparable<X>>(X x1, X x2) => x1.compareTo(x2) > 0 ? x1 : x2;

void main() {
  // Inferred as `max<num>(3, 7)` with the feature, fails without it.
  max(3, 7);
}
```

With inference using bounds, Dart can *deconstruct* type arguments,
extracting type information from a generic type parameter's bound.
This allows functions like `f` in the following example to preserve both the
specific iterable type (`List` or `Set`) *and* the element type.
Before inference using bounds, this wasn't possible 
without losing type safety or specific type information.

```dart
(X, Y) f<X extends Iterable<Y>, Y>(X x) => (x, x.first);

void main() {
  var (myList, myInt) = f([1]);
  myInt.whatever; // Compile-time error, `myInt` has type `int`.

  var (mySet, myString) = f({'Hello!'});
  mySet.union({}); // Works, `mySet` has type `Set<String>`.
}
```

Without inference using bounds, `myInt` would have the type `dynamic`.
The previous inference algorithm wouldn't catch the incorrect expression
`myInt.whatever` at compile time, and would instead throw at run time.
Conversely, `mySet.union({})` would be a compile-time error
without inference using bounds, because the previous algorithm couldn't
preserve the information that `mySet` is a `Set`.

For more information on the inference using bounds algorithm,
read the [design document][]. 


[F-bounded]: /language/generics/#f-bounds
[design document]: {{site.repo.dart.lang}}/blob/main/accepted/future-releases/3009-inference-using-bounds/design-document.md#motivating-example

## Substituting types

## 替换类型

When you override a method, you are replacing something of one type (in the
old method) with something that might have a new type (in the new method).
Similarly, when you pass an argument to a function,
you are replacing something that has one type (a parameter
with a declared type) with something that has another type
(the actual argument). When can you replace something that
has one type with something that has a subtype or a supertype?

当重写方法时，可以使用一个新类型（在新方法中）替换旧类型（在旧方法中）。
类似地，当参数传递给函数时，可以使用另一种类型（实际参数）
的对象替换现有类型（具有声明类型的参数）要求的对象。
什么时候可以用具有子类型或父类型的对象替换具有一种类型的对象那？

When substituting types, it helps to think in terms of _consumers_
and _producers_. A consumer absorbs a type and a producer generates a type.

从_消费者_和_生产者_的角度有助于我们思考替换类型的情况。
消费者接受类型，生产者产生类型。

**You can replace a consumer's type with a supertype and a producer's
type with a subtype.**

**可以使用父类型替换消费者类型，使用子类型替换生产者类型。**

Let's look at examples of simple type assignment and assignment with
generic types.

下面让我们看一下普通类型赋值和泛型类型赋值的示例。

### Simple type assignment

### 普通类型赋值

When assigning objects to objects, when can you replace a type with a
different type? The answer depends on whether the object is a consumer
or a producer.

将对象赋值给对象时，什么时候可以用其他类型替换当前类型？
答案取决于对象是消费者还是生产者。

Consider the following type hierarchy:

分析以下类型层次结构：

<img src="/assets/img/language/type-hierarchy.png" class="diagram-wrap" alt="a hierarchy of animals where the supertype is Animal and the subtypes are Alligator, Cat, and HoneyBadger. Cat has the subtypes of Lion and MaineCoon">

Consider the following simple assignment where `Cat c` is a _consumer_
and `Cat()` is a _producer_:

思考下面示例中的普通赋值，
其中 `Cat c` 是 **消费者** 而 `Cat()` 是 **生产者**：

<?code-excerpt "lib/strong_analysis.dart (Cat-Cat-ok)"?>
```dart
Cat c = Cat();
```

In a consuming position, it's safe to replace something that consumes a
specific type (`Cat`) with something that consumes anything (`Animal`),
so replacing `Cat c` with `Animal c` is allowed, because `Animal` is
a supertype of `Cat`.

在消费者的位置，任意类型（`Animal`）的对象替换特定类型（`Cat`）的对象是安全的。
因此使用 `Animal c` 替换 `Cat c` 是允许的，因为 Animal 是 Cat 的父类。

<?code-excerpt "lib/strong_analysis.dart (Animal-Cat-ok)"?>
```dart tag=passes-sa
Animal c = Cat();
```

But replacing `Cat c` with `MaineCoon c` breaks type safety, because the
superclass may provide a type of Cat with different behaviors, such
as `Lion`:

但是使用 `MaineCoon c` 替换 `Cat c` 会打破类型的安全性，
因为父类可能会提供一种具有不同行为的 Cat ，例如 Lion ：

<?code-excerpt "lib/strong_analysis.dart (MaineCoon-Cat-err)"?>
```dart tag=fails-sa
MaineCoon c = Cat();
```

In a producing position, it's safe to replace something that produces a
type (`Cat`) with a more specific type (`MaineCoon`). So, the following
is allowed:

在生产者的位置，可以安全地将生产类型 (Cat) 替换成一个更具体的类型
 (MaineCoon) 的对象。因此，下面的操作是允许的：

<?code-excerpt "lib/strong_analysis.dart (Cat-MaineCoon-ok)"?>
```dart tag=passes-sa
Cat c = MaineCoon();
```

### Generic type assignment

### 泛型赋值

Are the rules the same for generic types? Yes. Consider the hierarchy
of lists of animals—a `List` of `Cat` is a subtype of a `List` of
`Animal`, and a supertype of a `List` of `MaineCoon`:

上面的规则同样适用于泛型类型吗？是的。
考虑动物列表的层次结构&mdash; Cat 类型的 List 是 Animal 类型 List 的子类型，
是 MaineCoon 类型 List 的父类型。

<img src="/assets/img/language/type-hierarchy-generics.png" class="diagram-wrap" alt="List<Animal> -> List<Cat> -> List<MaineCoon>">

In the following example, 
you can assign a `MaineCoon` list to `myCats`
because `List<MaineCoon>` is a subtype of `List<Cat>`:

在下面的示例中，可以将 `MaineCoon` 类型的 List 赋值给 `myCats` ，
因为 `List<MaineCoon>` 是 `List<Cat>` 的子类型：

<?code-excerpt "lib/strong_analysis.dart (generic-type-assignment-MaineCoon)" replace="/<MaineCoon/<[!MaineCoon!]/g"?>
```dart tag=passes-sa
List<[!MaineCoon!]> myMaineCoons = ...
List<Cat> myCats = myMaineCoons;
```

What about going in the other direction? 
Can you assign an `Animal` list to a `List<Cat>`?

从另一个角度看，可以将 `Animal` 类型的 List 赋值给 `List<Cat>` 吗？

<?code-excerpt "lib/strong_analysis.dart (generic-type-assignment-Animal)" replace="/<Animal/<[!Animal!]/g"?>
```dart tag=fails-sa
List<[!Animal!]> myAnimals = ...
List<Cat> myCats = myAnimals;
```

This assignment doesn't pass static analysis 
because it creates an implicit downcast, 
which is disallowed from non-`dynamic` types such as `Animal`.

这个赋值不能通过静态分析，因为它创建了一个隐式的向下转型 (downcast)，
这在非 `dynamic` 类型中是不允许的，比如 `Animal`。

To make this type of code pass static analysis, 
you can use an explicit cast. 

若要这段代码能够通过静态分析，需要使用一个显式转换，
这可能会在运行时导致失败。

<?code-excerpt "lib/strong_analysis.dart (generic-type-assignment-implied-cast)" replace="/as.*(?=;)/[!$&!]/g"?>
```dart
List<Animal> myAnimals = ...
List<Cat> myCats = myAnimals [!as List<Cat>!];
```

An explicit cast might still fail at runtime, though,
depending on the actual type of the list being cast (`myAnimals`).

不过，显式转换在运行时仍然可能会失败，
这取决于转换被转换内容的实际类型 (此处是 `myAnimals`)。

### Methods

### 方法

When overriding a method, the producer and consumer rules still apply.
For example:

在重写方法中，生产者和消费者规则仍然适用。例如：

<img src="/assets/img/language/consumer-producer-methods.png" class="diagram-wrap" alt="Animal class showing the chase method as the consumer and the parent getter as the producer">

For a consumer (such as the `chase(Animal)` method), you can replace
the parameter type with a supertype. For a producer (such as
the `parent` getter method), you can replace the return type with
a subtype.

对于使用者（例如 `chase(Animal)` 方法），可以使用父类型替换参数类型。
对于生产者（例如 `父类` 的 Getter 方法），可以使用子类型替换返回值类型。

For more information, see
[Use sound return types when overriding methods](#use-proper-return-types)
and [Use sound parameter types when overriding methods](#use-proper-param-types).

有关更多信息，请参阅
[重写方法时，使用类型安全的返回值](#use-proper-return-types)
以及
[重写方法时，使用类型安全的参数](#use-proper-param-types)。

<a id="covariant-keyword" aria-hidden="true"></a>
#### Covariant parameters

Some (rarely used) coding patterns rely on tightening a type
by overriding a parameter's type with a subtype, which is invalid.
In this case, you can use the `covariant` keyword to
tell the analyzer that you're doing this intentionally.
This removes the static error and instead checks for an invalid
argument type at runtime.

The following shows how you might use `covariant`:

<?code-excerpt "lib/covariant.dart" replace="/covariant/[!$&!]/g"?>
```dart tag=passes-sa
class Animal {
  void chase(Animal x) {
     ...
  }
}

class Mouse extends Animal {
   ...
}

class Cat extends Animal {
  @override
  void chase([!covariant!] Mouse x) {
     ...
  }
}
```

Although this example shows using `covariant` in the subtype,
the `covariant` keyword can be placed in either the superclass
or the subclass method.
Usually the superclass method is the best place to put it.
The `covariant` keyword applies to a single parameter and is
also supported on setters and fields.

## Other resources

## 其他资源

The following resources have further information on sound Dart:

以下是更多关于 Dart 类型安全的相关资源：
  
* [Fixing type promotion failures](/tools/non-promotion-reasons) - 
  Understand and learn how to fix type promotion errors.

  [修复类型转换错误](/tools/non-promotion-reasons) -
  了解和学习如何修复类型转换错误

* [Sound null safety](/null-safety) - 
  Learn about writing code with sound null safety.

  [健全的空安全](/null-safety) -
  学习关于如何撰写健全的空安全代码。

* [Customizing static analysis][analysis] - 
  How to set up and customize the analyzer and linter
  using an analysis options file.

  [Customizing static analysis][analysis] -
  如何使用分析配置文件设置及自定义分析器和 linter。


[analysis]: /tools/analysis
[language version]: /resources/language/evolution#language-versioning
[null safety]: /null-safety
