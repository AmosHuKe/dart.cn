---
# title: "Asynchronous programming: Streams"
title: 异步编程：使用 stream
# description: Learn how to consume single-subscriber and broadcast streams.
description: 了解如何使用 single-subscriber 和 broadcast streams。
js: [{url: '/assets/js/inject_dartpad.js', defer: true}]
---

:::secondary 本章的重点
<!-- What's the point? -->

* Streams provide an asynchronous sequence of data.

  Stream 提供一个异步的数据序列。

* Data sequences include user-generated events and data read from files.

  数据序列包括用户生成的事件和从文件读取的数据。

* You can process a stream using either **await for** or `listen()` from the Stream API.

  你可以使用 Stream API 中的 `listen()` 方法和 **await for** 关键字来处理一个 Stream。

* Streams provide a way to respond to errors.

  当出现错误时，Stream 提供一种处理错误的方式。

* There are two kinds of streams: single subscription or broadcast.

  Stream 有两种类型：Single-Subscription 和 Broadcast。

:::

<iframe width="560" height="315" src="https://www.youtube.com/embed/nQBpOIHE4eE?si=hM5ONj3PXHckEuCS" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Asynchronous programming in Dart is characterized by the
[Future][] and [Stream][] classes.

[Future][] 和 [Stream][] 类是 Dart 异步编程的核心。

A Future represents a computation that doesn't complete immediately.
Where a normal function returns the result, an asynchronous function
returns a Future, which will eventually contain the result.
The future will tell you when the result is ready.

Future 表示一个不会立即完成的计算过程。与普通函数直接返回结果不同的是异步函数返回一个将会包含结果的 Future。该 Future 会在结果准备好时通知调用者。

A stream is a sequence of asynchronous events.
It is like an asynchronous Iterable—where, instead of getting
the next event when you ask for it, the stream tells you that
there is an event when it is ready.

Stream 是一系列异步事件的序列。其类似于一个异步的 Iterable，不同的是当你向 Iterable 获取下一个事件时它会立即给你，但是 Stream 则不会立即给你而是在它准备好时告诉你。

## Receiving stream events

## 接收 Stream 事件

Streams can be created in many ways, which is a topic for another
article, but they can all be used in the same way: the _asynchronous
for loop_ (commonly just called **await for**)
iterates over the events of a stream like the **for loop** iterates
over an [Iterable][]. For example:

Stream 可以通过许多方式创建，这个话题我们会在另一篇文章详述，
而这些所有的创建方式都可以相同的方式在代码中使用：
像使用 **for 循环** 迭代一个 Iterable 一样，
我们可以使用 **异步 for 循环** （通常我们直接称之为 **await for**）
来迭代 Stream 中的事件。例如：

<?code-excerpt "misc/lib/tutorial/sum_stream.dart (sum-stream)" replace="/async|await for/[!$&!]/g"?>
```dart
Future<int> sumStream(Stream<int> stream) [!async!] {
  var sum = 0;
  [!await for!] (final value in stream) {
    sum += value;
  }
  return sum;
}
```

This code simply receives each event of a stream of integer events,
adds them up, and returns (a future of) the sum.
When the loop body ends,
the function is paused until the next event arrives or the stream is done.

该代码只是简单地接收整型事件流中的每一个事件并将它们相加，
然后返回（被 Future 包裹）相加后的整型值。
当循环体结束时，函数会暂停直到下一个事件到达或 Stream 完成。

The function is marked with the `async` keyword, which is required
when using the **await for** loop.

内部使用 **await for** 循环的函数需要使用 `async` 关键字标记。

The following example tests the previous code by
generating a simple stream of integers using an `async*` function:

下面的示例中使用了 `async*` 函数生成一个简单的
整型 Stream 来测试上一个代码片段：

:::note

This page uses embedded DartPads to display runnable examples.

本页面内嵌了一些 DartPads 做例子展示，

{% render 'dartpads-embedded-troubleshooting.md' %}
:::

<?code-excerpt "misc/lib/tutorial/sum_stream.dart"?>
```dartpad
Future<int> sumStream(Stream<int> stream) async {
  var sum = 0;
  await for (final value in stream) {
    sum += value;
  }
  return sum;
}

Stream<int> countStream(int to) async* {
  for (int i = 1; i <= to; i++) {
    yield i;
  }
}

void main() async {
  var stream = countStream(10);
  var sum = await sumStream(stream);
  print(sum); // 55
}
```

:::note
  
Click **Run** to see the result in the **Console**.

**注意：** 点击 **Run** 可以在 **控制台输出** 查看结果。
  
:::

## Error events

## 错误事件

Streams are done when there are no more events in them,
and the code receiving the events is notified of this just as
it is notified that a new event arrives.
When reading events using an **await for** loop,
the loops stops when the stream is done.

当 Stream 再也没有需要处理的事件时会变为完成状态，
与此同时，调用者可以像接收到新事件回调那样接收 Stream 完成的事件回调。
当使用 **await for** 循环读取事件时，循环会在 Stream 完成时停止。

In some cases, an error happens before the stream is done;
perhaps the network failed while fetching a file from a remote server,
or perhaps the code creating the events has a bug,
but someone needs to know about it.

有时在 Stream 完成前会出现错误；
比如从远程服务器获取文件时出现网络请求失败，
或者创建事件时出现 bug，尽管错误总是会有可能存在，
但它出现时应该告知使用者。

Streams can also deliver error events like it delivers data events.
Most streams will stop after the first error,
but it is possible to have streams that deliver more than one error,
and streams that deliver more data after an error event.
In this document we only discuss streams that deliver at most one error.

Stream 可以像提供数据事件那样提供错误事件。
大多数 Stream 会在第一次错误出现后停止，
但其也可以提供多次错误并可以在在出现错误后继续提供数据事件。
在本篇文档中我们只讨论 Stream 最多出现并提供一次错误事件的情况。

When reading a stream using **await for**, the error is thrown by the
loop statement. This ends the loop, as well. You can catch the
error using **try-catch**.  The following example throws an
error when the loop iterator equals 4:

当使用 **await for** 读取 Stream 时，
如果出现错误，则由循环语句抛出，同时循环结束。
你可以使用 **try-catch** 语句捕获错误。
下面的示例会在循环迭代到参数值等于 4 时抛出一个错误：

<?code-excerpt "misc/lib/tutorial/sum_stream_with_catch.dart"?>
```dartpad
Future<int> sumStream(Stream<int> stream) async {
  var sum = 0;
  try {
    await for (final value in stream) {
      sum += value;
    }
  } catch (e) {
    return -1;
  }
  return sum;
}

Stream<int> countStream(int to) async* {
  for (int i = 1; i <= to; i++) {
    if (i == 4) {
      throw Exception('Intentional exception');
    } else {
      yield i;
    }
  }
}

void main() async {
  var stream = countStream(10);
  var sum = await sumStream(stream);
  print(sum); // -1
}
```

:::note

Click **Run** to see the result in the **Console**.

**注意：** 点击 **Run** 可以在 **控制台输出** 查看结果。

:::

## Working with streams

## Stream 的使用

The Stream class contains a number of helper methods that can do
common operations on a stream for you,
similar to the methods on an [Iterable.][Iterable]
For example, you can find the last positive integer in a stream using
`lastWhere()` from the Stream API.

Stream 类中包含了许多像 [Iterable][Iterable]
类中一样的辅助方法帮助你实现一些常用的操作。
例如，你可以使用 Stream API 中的 `lastWhere()`
方法从 Stream 中找出最后一个正整数。

<?code-excerpt "misc/lib/tutorial/misc.dart (last-positive)"?>
```dart
Future<int> lastPositive(Stream<int> stream) =>
    stream.lastWhere((x) => x >= 0);
```

## Two kinds of streams {:#two-kinds-of-streams}

## Stream 的两种类型

There are two kinds of streams.

Stream 有两种类型。

### Single subscription streams {:#single-subscription-streams}

### Single-Subscription 类型的 Stream

The most common kind of stream contains a sequence of events that
are parts of a larger whole.
Events need to be delivered in the correct order and without
missing any of them.
This is the kind of stream you get when you read a file or receive
a web request.

最常见的类型是一个 Stream 只包含了某个众多事件序列的一个。
而这些事件需要按顺序提供并且不能丢失。
当你读取一个文件或接收一个网页请求时就需要使用这种类型的 Stream。

Such a stream can only be listened to once.
Listening again later could mean missing out on initial events,
and then the rest of the stream makes no sense.
When you start listening,
the data will be fetched and provided in chunks.

这种 Stream 只能设置一次监听。重复设置则会丢失原来的事件，
而导致你所监听到的剩余其它事件毫无意义。
当你开始监听时，数据将以块的形式提供和获取。

### Broadcast streams {:#broadcast-streams}

### Broadcast 类型的 Stream

The other kind of stream is intended for individual messages that
can be handled one at a time. This kind of stream can be used for
mouse events in a browser, for example.

另一种流是针对单个消息的，这种流可以一次处理一个消息。
例如可以将其用于浏览器的鼠标事件。

You can start listening to such a stream at any time,
and you get the events that are fired while you listen.
More than one listener can listen at the same time,
and you can listen again later after canceling a previous
subscription.

你可以在任何时候监听这种 Stream，
且在此之后你可以获取到任何触发的事件。
这种流可以在同一时间设置多个不同的监听器同时监听，
同时你也可以在取消上一个订阅后再次对其发起监听。

## Methods that process a stream {:#process-stream-methods}

## 处理 Stream 的方法

The following methods on [Stream\<T>][Stream] process the stream and return a
result:

下面这些 [Stream\<T>][Stream] 类中的方法可以对 Stream 进行处理并返回结果：

<?code-excerpt "misc/lib/tutorial/stream_interface.dart (main-stream-members)" remove="/^\s*Stream/"?>
```dart
Future<T> get first;
Future<bool> get isEmpty;
Future<T> get last;
Future<int> get length;
Future<T> get single;
Future<bool> any(bool Function(T element) test);
Future<bool> contains(Object? needle);
Future<E> drain<E>([E? futureValue]);
Future<T> elementAt(int index);
Future<bool> every(bool Function(T element) test);
Future<T> firstWhere(bool Function(T element) test, {T Function()? orElse});
Future<S> fold<S>(S initialValue, S Function(S previous, T element) combine);
Future forEach(void Function(T element) action);
Future<String> join([String separator = '']);
Future<T> lastWhere(bool Function(T element) test, {T Function()? orElse});
Future pipe(StreamConsumer<T> streamConsumer);
Future<T> reduce(T Function(T previous, T element) combine);
Future<T> singleWhere(bool Function(T element) test, {T Function()? orElse});
Future<List<T>> toList();
Future<Set<T>> toSet();
```

All of these functions, except `drain()` and `pipe()`,
correspond to a similar function on [Iterable.][Iterable]
Each one can be written easily by using an `async` function
with an **await for** loop (or just using one of the other methods).
For example, some implementations could be:

上述所有的方法，除了 `drain()` and `pipe()` 方法外，
都在 [Iterable][Iterable] 类中有对应的相似方法。
如果你在异步函数中使用了 **await for** 循环（或者只是在另一个方法中使用），
那么使用上述的这些方法将会更加容易。例如，一些代码实现大概是这样的：

<?code-excerpt "misc/lib/tutorial/misc.dart (mock-stream-method-implementations)"?>
```dart
Future<bool> contains(Object? needle) async {
  await for (final event in this) {
    if (event == needle) return true;
  }
  return false;
}

Future forEach(void Function(T element) action) async {
  await for (final event in this) {
    action(event);
  }
}

Future<List<T>> toList() async {
  final result = <T>[];
  await forEach(result.add);
  return result;
}

Future<String> join([String separator = '']) async =>
    (await toList()).join(separator);
```

(The actual implementations are slightly more complex,
but mainly for historical reasons.)

（上述代码只是个简单的示例，实际的实现逻辑可能要稍微复杂一点。）

## Methods that modify a stream {:#modify-stream-methods}

## 修改 Stream 的方法

The following methods on `Stream` return a new stream based
on the original stream.
Each one waits until something listens on the new stream before
listening on the original.

下面关于 `Stream` 的方法可以对原始的 Stream 进行处理并返回新的 Stream。
当调用了这些方法后，设置在原始 Stream 上的监听器
会先监听被转换后的新 Stream，
待新的 Stream 处理完成后才会转而回去监听原始的 Stream。

<?code-excerpt "misc/lib/tutorial/stream_interface.dart (main-stream-members)" remove="/async\w+|distinct|transform/" retain="/^\s*Stream/"?>
```dart
Stream<R> cast<R>();
Stream<S> expand<S>(Iterable<S> Function(T element) convert);
Stream<S> map<S>(S Function(T event) convert);
Stream<T> skip(int count);
Stream<T> skipWhile(bool Function(T element) test);
Stream<T> take(int count);
Stream<T> takeWhile(bool Function(T element) test);
Stream<T> where(bool Function(T event) test);
```

The preceding methods correspond to similar methods on [Iterable][],
which transform an iterable into another iterable.
All of these can be written easily using an `async` function
with an **await for** loop.

在 [Iterable][] 类中也有一些将一个 iterable 转换为另一个 iterable 的方法，
上述的这些方法与 [Iterable][] 类中的这些方法相似。
如果你在异步函数中使用了 **await for** 循环，
那么使用上述的这些方法将会更加容易。

<?code-excerpt "misc/lib/tutorial/stream_interface.dart (main-stream-members)" remove="/transform/" retain="/async\w+|distinct/"?>
```dart
Stream<E> asyncExpand<E>(Stream<E>? Function(T event) convert);
Stream<E> asyncMap<E>(FutureOr<E> Function(T event) convert);
Stream<T> distinct([bool Function(T previous, T next)? equals]);
```

The `asyncExpand()` and `asyncMap()` functions are similar to
`expand()` and `map()`,
but allow their function argument to be an asynchronous function.
The `distinct()` function doesn't exist on `Iterable`, but it could have.

`asyncExpand()` 和 `asyncMap()` 方法与 `expand()` 和 `map()` 方法类似，
不同的是前两者允许将一个异步函数作为函数参数。
`Iterable` 中没有与 `distinct()` 类似的方法，
但是在不久的将来可能会加上。

<?code-excerpt "misc/lib/tutorial/stream_interface.dart (special-stream-members)"?>
```dart
Stream<T> handleError(Function onError, {bool Function(dynamic error)? test});
Stream<T> timeout(
  Duration timeLimit, {
  void Function(EventSink<T> sink)? onTimeout,
});
Stream<S> transform<S>(StreamTransformer<T, S> streamTransformer);
```

The final three functions are more specialized.
They involve error handling that an **await for** loop
cannot directly manage; the first error encountered will
terminate the loop and its stream subscription, with no
built-in mechanism for recovery.

最后这三个方法比较特殊。
它们用于处理 **await for** 循环不能处理的错误：
当循环执行过程中出现错误时，该循环会结束同时取消 Stream 上的订阅且不能恢复。

The following code demonstrates how to use `handleError()`
to filter out errors from a stream before it's consumed by
an **await for** loop.

以下代码演示了如何在 **await for** 循环处理 stream 之前，
使用 `handleError()` 过滤掉 Stream 中的错误。

<?code-excerpt "misc/lib/tutorial/misc.dart (map-log-errors)" plaster="none"?>
```dart highlightLines=5
Stream<S> mapLogErrors<S, T>(
  Stream<T> stream,
  S Function(T event) convert,
) async* {
  var streamWithoutErrors = stream.handleError((e) => log(e));

  await for (final event in streamWithoutErrors) {
    yield convert(event);
  }
}
```

In the previous example, an **await for** loop is never
returned to if no events are emitted by the stream.
To avoid this, use the `timeout()` function to create
a new stream. `timeout()` enables you to set a
time limit and continue emitting events on the returned
stream.

The following code modifies the previous example. 
It adds a two-second timeout and produces a
relevant error if no events occur for two or more seconds.

<?code-excerpt "misc/lib/tutorial/misc.dart (stream-timeout)"?>
```dart highlightLines=6-12
Stream<S> mapLogErrors<S, T>(
  Stream<T> stream,
  S Function(T event) convert,
) async* {
  var streamWithoutErrors = stream.handleError((e) => log(e));
  var streamWithTimeout = streamWithoutErrors.timeout(
    const Duration(seconds: 2),
    onTimeout: (eventSink) {
      eventSink.addError('Timed out after 2 seconds');
      eventSink.close();
    },
  );

  await for (final event in streamWithTimeout) {
    yield convert(event);
  }
}
```

### The transform() function {:#transform-function}

### transform() 方法

The `transform()` function is not just for error handling;
it is a more generalized "map" for streams.
A normal map requires one value for each incoming event.
However, especially for I/O streams,
it might take several incoming events to produce an output event.
A [StreamTransformer][] can work with that.
For example, decoders like [Utf8Decoder][] are transformers.
A transformer requires only one function, [bind()][], which can be
easily implemented by an `async` function.

`transform()` 方法并不只是用于处理错误；它更是一个通用的 Stream “map 映射”。
通常而言，一个 “map 映射”会为每一个输入事件设置一个值。
但是对于 I/O Stream 而言，它可能会使用多个输入事件来生成一个输出事件。
这时候使用 [StreamTransformer][] 就可以做到这一点。
例如像 [Utf8Decoder][] 这样的解码器就是一个变换器。
一个变换器只需要实现一个 [bind()][] 方法，
其可通过 `async` 函数轻松实现。

### Reading and decoding a file {:#reading-decoding-file}

### 读取和解码文件

The following code reads a file and runs two transforms over the stream.
It first converts the data from UTF8 and then runs it through
a [LineSplitter.][LineSplitter]
All lines are printed, except any that begin with a hashtag, `#`.

下面的代码示例读取一个文件并在其 Stream 上执行了两次变换。
第一次转换是将文件数据转换成 UTF-8 编码格式，
然后将转换后的数据变换成一个 [LineSplitter][LineSplitter] 执行。
文件中除了 `#` 开头的行外其它的行都会被打印出来。

<?code-excerpt "misc/bin/cat_no_hash.dart"?>
```dart
import 'dart:convert';
import 'dart:io';

void main(List<String> args) async {
  var file = File(args[0]);
  var lines = utf8.decoder
      .bind(file.openRead())
      .transform(const LineSplitter());
  await for (final line in lines) {
    if (!line.startsWith('#')) print(line);
  }
}
```

## The listen() method {:#listen-method}

## listen() 方法

The final method on Stream is `listen()`. This is a "low-level"
method—all other stream functions are defined in terms of `listen()`.

最后一个重要的方法是 `listen()`。这是一个“底层”方法，
其它所有的 Stream 方法都根据 `listen()` 方法定义。

<?code-excerpt "misc/lib/tutorial/stream_interface.dart (listen)"?>
```dart
StreamSubscription<T> listen(
  void Function(T event)? onData, {
  Function? onError,
  void Function()? onDone,
  bool? cancelOnError,
});
```

To create a new `Stream` type, you can just extend the `Stream`
class and implement the `listen()` method—all other methods
on `Stream` call `listen()` in order to work.

你只需继承 `Stream` 类并实现 `listen()` 方法来创建一个 `Stream` 类型的子类。
`Stream` 类中所有其它的方法都依赖于对 `listen()` 方法的调用。

The `listen()` method allows you to start listening on a stream.
Until you do so,
the stream is an inert object describing what events you want to see.
When you listen,
a [StreamSubscription][] object is returned which represents the
active stream producing events.
This is similar to how an `Iterable` is just a collection of objects,
but the iterator is the one doing the actual iteration.

`listen()` 方法可以让你对一个 Stream 进行监听。
在你对一个 Stream 进行监听前，它只不过是个惰性对象，
该对象描述了你想查看的事件。当你对其进行监听后，
其会返回一个 [StreamSubscription][] 对象，
该对象用以表示一个生产事件的活跃的 Stream。
这与 `Iterable` 对象的实现方式类似，
不同的是 `Iterable` 对象可返回迭代器并可以进行真实的迭代操作。

The stream subscription allows you to pause the subscription,
resume it after a pause,
and cancel it completely.
You can set callbacks to be called for each data event or
error event, and when the stream is closed.

Stream 允许你暂停、继续甚至完全取消一个订阅。
你也可以为其设置一个回调，该回调会在每一个数据事件、
错误事件以及 Stream 自身关闭时通知调用者。

## Other resources

## 其它资源信息

Read the following documentation for more details on using streams
and asynchronous programming in Dart.

可以阅读下面的文档获取更多关于在 Dart 中使用 Stream 和异步编程的信息：

* [Creating Streams in Dart](/libraries/async/creating-streams),
  an article about creating your own streams

  [在 Dart 中创建 Stream](/libraries/async/creating-streams), 该文将向你介绍如何创建 Stream。

* [Futures and Error Handling](/libraries/async/futures-error-handling),
  an article that explains how to handle errors using the Future API

  [Futures 以及错误处理](/libraries/async/futures-error-handling), 该文将向你介绍如何在使用 Future API 时处理相关错误。

* [Asynchronous programming](/language/async),
  which goes in-depth into Dart's language support for asynchrony

  [异步编程](/language/async)，深入介绍了 Dart 语言对异步的支持。

* [Stream API reference]({{site.dart-api}}/dart-async/Stream-class.html)

  [Stream API 参考文档]({{site.dart-api}}/dart-async/Stream-class.html)

[bind()]: {{site.dart-api}}/dart-async/StreamTransformer/bind.html
[LineSplitter]: {{site.dart-api}}/dart-convert/LineSplitter-class.html
[Future]: {{site.dart-api}}/dart-async/Future-class.html
[Iterable]: {{site.dart-api}}/dart-core/Iterable-class.html
[Stream]: {{site.dart-api}}/dart-async/Stream-class.html
[StreamSubscription]: {{site.dart-api}}/dart-async/StreamSubscription-class.html
[StreamTransformer]: {{site.dart-api}}/dart-async/StreamTransformer-class.html
[Utf8Decoder]: {{site.dart-api}}/dart-convert/Utf8Decoder-class.html
