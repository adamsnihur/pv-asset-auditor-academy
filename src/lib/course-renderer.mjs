import katex from 'katex';
import { marked } from 'marked';

const MATH_TOKEN = 'PVACADEMYMATHTOKEN';

function protectMath(markdown) {
  const fragments = [];
  const store = (latex, displayMode) => {
    const token = `${MATH_TOKEN}${fragments.length}Z`;
    fragments.push(katex.renderToString(latex.trim(), {
      displayMode,
      output: 'htmlAndMathml',
      strict: 'ignore',
      throwOnError: false,
    }));
    return token;
  };

  const protectedMarkdown = markdown
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, latex) => store(latex, true))
    .replace(/\$([^$\n]+?)\$/g, (_, latex) => store(latex, false));

  return { protectedMarkdown, fragments };
}

function restoreMath(html, fragments) {
  return html.replace(new RegExp(`${MATH_TOKEN}(\\d+)Z`, 'g'), (_, index) => fragments[Number(index)]);
}

function hardenExternalLinks(html) {
  return html.replace(/<a href="(https?:\/\/[^"\s]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
}

export function renderCourseMarkdown(markdown) {
  const { protectedMarkdown, fragments } = protectMath(markdown);
  const html = marked.parse(protectedMarkdown, { gfm: true, breaks: false });
  return hardenExternalLinks(restoreMath(html, fragments));
}
