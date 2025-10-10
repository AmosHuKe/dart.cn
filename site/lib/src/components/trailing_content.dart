// Copyright (c) 2025, the Dart project authors. Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

import 'package:jaspr/jaspr.dart';
import 'package:jaspr_content/jaspr_content.dart';

import 'feedback.dart';

/// The trailing content of a content documentation page, such as
/// its last updated information, report an issue links, and similar.
class TrailingContent extends StatelessComponent {
  const TrailingContent({super.key, this.repo, this.sdkVersion});

  final String? repo;
  final String? sdkVersion;

  @override
  Component build(BuildContext context) {
    final page = context.page;
    final pageUrl = page.url;
    final pageData = page.data.page;
    final siteData = page.data.site;
    final branch = siteData['branch'] as String? ?? 'main';
    final repoLinks = siteData['repo'] as Map<String, Object?>? ?? {};
    final repoUrl =
        repo ??
        repoLinks['this'] as String? ??
        'https://github.com/cfug/dart.cn';
    final inputPath = pageData['inputPath'] as String?;
    final pageDate = pageData['date'] as String?;

    final currentSdkVersion =
        sdkVersion ?? siteData['sdkVersion'] as String? ?? '';
    final siteUrl = siteData['url'] as String? ?? 'https://dart.cn';

    final fullPageUrl = '$siteUrl$pageUrl';
    final String issueUrl;
    final String? pageSource;

    if (inputPath != null) {
      pageSource = '$repoUrl/blob/$branch/${inputPath.replaceAll('./', '')}';
      issueUrl =
          '$repoUrl/issues/new?template=1_page_issue.yml&page-url=$fullPageUrl&page-source=$pageSource';
    } else {
      pageSource = null;
      issueUrl =
          '$repoUrl/issues/new?template=1_page_issue.yml&page-url=$fullPageUrl';
    }

    return div(
      id: 'trailing-content',
      attributes: {'data-nosnippet': 'true'},
      [
        FeedbackComponent(issueUrl: issueUrl),

        p(id: 'page-github-links', [
          span([
            text(
              '除非另有说明，文档之所提及适用于 Dart $currentSdkVersion 版本，',
            ),
            if (pageDate != null)
              text(
                '本页面最后更新时间：$pageDate。',
              ),
          ]),
          if (pageSource != null) ...[
            a(
              href: pageSource,
              attributes: {'target': '_blank', 'rel': 'noopener'},
              [text('查看文档源码')],
            ),
            span([text(' 或者 ')]),
          ],
          a(
            href: issueUrl,
            attributes: {
              'title': '为本页面内容提出建议',
              'target': '_blank',
              'rel': 'noopener',
            },
            [text(pageSource == null ? '报告页面问题' : '报告页面问题')],
          ),
          text('。'),
        ]),
      ],
    );
  }
}
