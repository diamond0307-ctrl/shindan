/* No storage, analytics or network requests: answers live only in this closure. */
(() => {
  'use strict';
  const root = document.querySelector('.lab-diagnosis');
  if (!root) return;
  const find = (selector) => root.querySelector(selector);
  const questions = [
    ['あなたが1日仕事をしなかったら、仕事は進みますか？', '自分が止まったとき、仕事の流れがどこまで動くかを見ます。', ['ほぼ止まる', '一部は進む', 'ある程度は進む']],
    ['SNSや集客の発信は、毎回ゼロから考えていますか？', '発信が“その場しのぎ”なのか、“型”になっているのかを見ます。', ['毎回その場で考えている', 'ある程度パターンはある', '流れや型が決まっている']],
    ['今の仕事は、自分が手を動かし続けなくても進む部分がありますか？', 'AI・仕組み・導線などに、どこまで任せられているかを見ます。', ['ほとんどない', '一部ある', '複数ある']],
    ['文章・画像・資料づくりには、どのくらい時間がかかりますか？', '制作作業に、時間を取られすぎていないかを見ます。', ['かなり時間がかかる', '少し時短できている', 'かなり効率化できている']],
    ['『自分にしかできない仕事』を分けて考えられていますか？', '全部を自分で抱えていないかを見ます。', ['ほとんど分けられていない', 'なんとなく分かっている', 'かなり整理できている']],
    ['あなたが直接説明しなくても、サービス内容はある程度伝わる状態ですか？', '発信・LP・資料などが、どこまであなたの代わりになっているかを見ます。', ['ほとんど伝わっていない', '一部は伝わる', 'かなり伝わる']],
    ['仕事の予定より、自分の予定を先に決められていますか？', '仕事に人生を合わせるのではなく、人生に仕事を合わせられているかを見ます。', ['仕事に合わせて生活を決めることが多い', 'ある程度は調整できる', '自分の予定を先に決められる']]
  ];
  // Phrase-level line breaks keep Japanese questions readable on narrow screens.
  const questionLines = [
    ['あなたが1日', '仕事をしなかったら、', '仕事は進みますか？'],
    ['SNSや集客の発信は、', '毎回ゼロから考えていますか？'],
    ['今の仕事は、自分が', '手を動かし続けなくても', '進む部分がありますか？'],
    ['文章・画像・資料づくりには、', 'どのくらい時間がかかりますか？'],
    ['『自分にしかできない仕事』を', '分けて考えられていますか？'],
    ['あなたが直接説明しなくても、', 'サービス内容はある程度', '伝わる状態ですか？'],
    ['仕事の予定より、', '自分の予定を先に', '決められていますか？']
  ];
  const results = [
    { max: 9, title: 'ひとりで抱えがちなスタート期', description: '今はまだ、自分が動くことで仕事を回している段階。\nでも、それは伸びしろがはっきり見えている状態でもあります。', strength: '自分の力で進める力', growth: '仕事を分ける力', message: 'まずは、“全部自分でやる”から抜け出す一歩を知ろう。', action: '毎回書いているメールをひとつ選び、定型文にしてみましょう。小さな繰り返しから手放せます。' },
    { max: 12, title: '手を動かして形にする実践期', description: 'AIやツールを使いながら、少しずつ形にできている段階。\nただし、まだ“自分が回している仕事”が中心です。', strength: 'つくる力', growth: '任せる力', message: '次は、AIを使うだけでなく、AIに任せる発想へ。', action: 'SNS投稿の下書きを、いつも使う指示とセットに。AIに任せる範囲をひとつ決めてみましょう。' },
    { max: 15, title: '型をつくり始める設計期', description: '発信や仕事の流れにパターンが生まれ、\n少しずつ“自走の土台”ができてきている段階です。', strength: '整える力', growth: '仕組みにする力', message: 'ここからは、“頑張る”より“回る”へ変えていく段階です。', action: '問い合わせに毎回答える仕事を、よくある質問のページへ。説明の繰り返しを減らしてみましょう。' },
    { max: 18, title: '回る仕組みを育てる成長期', description: 'すでに一部の仕事は自分が動かなくても進み始めています。\nここから先は、精度と再現性を高めるフェーズです。', strength: '仕組み化する力', growth: '安定させる力', message: '次は、“回る”を“育つ”へ変えていこう。', action: '毎回の進み具合の確認を、週に一度のチェックへ。見る項目を決めて、仕組みを整えましょう。' },
    { max: 21, title: '人生から仕事を設計できる自走期', description: '仕事に人生を合わせるのではなく、\n人生に合わせて仕事を設計できている状態です。', strength: '自走させる力', growth: '広げる力', message: 'ここからは、あなた自身だけでなく、人や仕組みを育てる段階へ。', action: '自分だけが知っている運用手順を、共有できる形へ。人に引き継げる仕事をひとつ増やしましょう。' }
  ];
  let answers = Array(questions.length).fill(null);
  let current = 0;
  const intro = find('[data-ld-intro]');
  const question = find('[data-ld-question]');
  const result = find('[data-ld-result]');
  const event = find('#lab-next-step');
  const next = find('[data-ld-next]');
  const choices = find('.lab-diagnosis__choices');
  function focusAndReveal(heading, panel) {
    heading.focus({ preventScroll: true });
    // The standalone site uses normal document scrolling.
    window.scrollTo({ top: Math.max(0, window.scrollY + panel.getBoundingClientRect().top - 20), behavior: 'instant' });
  }
  function updateProgress() {
    const count = answers.filter((answer) => answer !== null).length;
    find('progress').value = count;
    root.querySelectorAll('[data-ld-step]').forEach((step, index) => {
      step.classList.toggle('is-answered', answers[index] !== null);
      step.classList.toggle('is-current', index === current);
    });
    find('[data-ld-count]').textContent = `${count} / 7 回答済み`;
  }
  function renderQuestion() {
    delete root.dataset.level;
    intro.hidden = true; result.hidden = true; event.hidden = true; question.hidden = false;
    const [, hint, options] = questions[current];
    find('[data-ld-counter]').textContent = `QUESTION ${String(current + 1).padStart(2, '0')} / 07`;
    find('#ld-question-title').replaceChildren(...questionLines[current].map((text) => {
      const span = document.createElement('span');
      span.className = 'lab-diagnosis__question-line'; span.textContent = text; return span;
    }));
    find('#ld-question-hint').textContent = hint;
    choices.replaceChildren(...options.map((text, index) => {
      const label = document.createElement('label');
      label.className = 'lab-diagnosis__choice';
      const input = document.createElement('input');
      input.type = 'radio'; input.name = 'lab-diagnosis-answer'; input.value = String(index + 1); input.checked = answers[current] === index + 1;
      const letter = document.createElement('span'); letter.className = 'lab-diagnosis__choice-letter'; letter.textContent = 'ABC'[index]; letter.setAttribute('aria-hidden', 'true');
      const copy = document.createElement('span'); copy.className = 'lab-diagnosis__choice-text'; copy.textContent = text;
      const check = document.createElement('span'); check.className = 'lab-diagnosis__choice-check'; check.textContent = '✓'; check.setAttribute('aria-hidden', 'true');
      label.append(input, letter, copy, check); return label;
    }));
    next.disabled = answers[current] === null;
    next.textContent = current === questions.length - 1 ? '診断結果を見る' : '次へ';
    updateProgress();
    focusAndReveal(find('#ld-question-title'), question);
  }
  choices.addEventListener('change', (e) => {
    if (!e.target.matches('input[type="radio"]')) return;
    answers[current] = Number(e.target.value);
    next.disabled = false;
    updateProgress();
  });
  find('[data-ld-start]').disabled = false;
  find('[data-ld-start]').addEventListener('click', renderQuestion);
  find('[data-ld-back]').addEventListener('click', () => {
    if (current > 0) { current--; renderQuestion(); }
    else { question.hidden = true; intro.hidden = false; focusAndReveal(find('.lab-diagnosis__title'), intro); }
  });
  next.addEventListener('click', () => {
    if (answers[current] === null || question.hidden) return;
    if (current < questions.length - 1) { current++; renderQuestion(); return; }
    if (answers.some((answer) => answer === null)) return;
    const score = answers.reduce((sum, answer) => sum + answer, 0);
    const level = results.findIndex((entry) => score <= entry.max);
    const data = results[level];
    root.dataset.level = String(level + 1);
    find('[data-ld-level]').textContent = String(level + 1);
    find('[data-ld-result-title]').replaceChildren(...data.title.split(/(?=スタート期|実践期|設計期|成長期|自走期)/).map((text) => {
      const span = document.createElement('span');
      span.className = 'lab-diagnosis__phrase'; span.textContent = text;
      return span;
    }));
    for (const key of ['description', 'strength', 'growth', 'message', 'action']) find(`[data-ld-${key}]`).textContent = data[key];
    // Wrap at phrase boundaries without changing the result copy.
    find('[data-ld-message]').replaceChildren(...data.message.split(/(?<=、)|(?<=”から)|(?<=”より)|(?<=”を)|(?<=”へ)/u).map((text) => {
      const span = document.createElement('span');
      span.className = 'lab-diagnosis__phrase';
      span.textContent = text;
      return span;
    }));
    question.hidden = true; result.hidden = false; event.hidden = false;
    focusAndReveal(find('[data-ld-result-title]'), result);
  });
  find('[data-ld-retry]').addEventListener('click', () => { answers = Array(questions.length).fill(null); current = 0; renderQuestion(); });
  find('[data-ld-event-link]').addEventListener('click', (e) => {
    e.preventDefault(); focusAndReveal(find('#ld-event-title'), event);
  });
})();
