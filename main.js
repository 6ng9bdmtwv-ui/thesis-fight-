//要素の取得
//HTML内のidを指定してJSて操作できるようにする
const memoInput = document.getElementById('memo-input');
const memoAddBtn = document.getElementById('memo-add-btn');
const memoList = document.getElementById('memo-list');

// ページ切り替え
const navItems = {
    memo: document.getElementById('nav-memo'),
    paper: document.getElementById('nav-paper'),
};

const pages = {
    memo: document.getElementById('page-memo'),
    paper: document.getElementById('page-paper'),
};

// 指定したページに切り替える関数
function showPage(name){
    //すべてのページを非表示・すべてのナビを非アクティブ
    Object.keys(pages).forEach(function(key){
        pages[key].classList.add('hidden');
        navItems[key].classList.remove('active');
    });

    //指定したページだけ表示・ナビをアクティブに
    pages[name].classList.remove('hidden');
    navItems[name].classList.add('active');

}

//ナビクリックでページ切り替え
navItems.memo.addEventListener('click',  function() { showPage('memo'); });
navItems.paper.addEventListener('click', function() { showPage('paper'); });

//ボタンが押されたときの処理
memoAddBtn.addEventListener('click',function(){
    addMemo();
});

//Ctrl+Enterで追加できるようにする
memoInput.addEventListener('keydown', function(event){
    if(event.ctrlKey && event.key === 'Enter'){
        addMemo();
    }
});

//メモを追加する関数
function addMemo(){
    const text = memoInput.value.trim();
    if(text === '') return;

    const dateStr = getDateStr();

    const memo = {
        id:   Date.now(),
        text: text,
        date: getDateStr(),
    };

    memos.unshift(memo);
    saveData();

    //リストの項目<li>をつくる
    const li = document.createElement('li');
    li.className = 'memo-item';
    li.innerHTML =`
        <div class="memo-text">${text}</div>
        <div class="memo-date">${dateStr}</div>
        <button class="memo-delete-btn">削除</button>
        `;
    // 削除ボタンが押されたときの処理
    const deleteBtn =li.querySelector('.memo-delete-btn');
        deleteBtn.addEventListener('click',function(){
        const index = memos.findIndex(m => m.id === memo.id);
        memos.splice(index, 1);
        li.remove();
        saveData();
    });

    //リストの先頭に追加（新しいものが上に）
    memoList.prepend(li);

    //入力欄を空に
    memoInput.value = '';
    memoInput.focus(); //カーソルを入力欄に戻す
}

//資料管理
const papers= [];
const memos = [];

const paperAddBtn = document.getElementById('paper-add-btn');
const paperList   = document.getElementById('paper-list');

paperAddBtn.addEventListener('click', function(){ addPaper();});

//資料を登録する処理
function addPaper(){
    const title  = document.getElementById('paper-title').value.trim();
    const url    = document.getElementById('paper-url').value.trim();
    const reason = document.getElementById('paper-reason').value.trim();
    const memo   = document.getElementById('paper-memo').value.trim();
    const citation = document.getElementById('paper-citation').value.trim();
    if (title === ''){
        alert('タイトルを入力してください');
        return;
                    }
    const paper = {
    id:     Date.now(),
    title:  title,
    url:    url,
    reason: reason,
    memo:   memo,
    citation: citation,
    date:   getDateStr(),
   };


  papers.unshift(paper);
  renderPapers();
  saveData();

  document.getElementById('paper-title').value  = '';
  document.getElementById('paper-url').value    = '';
  document.getElementById('paper-reason').value = '';
  document.getElementById('paper-memo').value   = '';
  document.getElementById('paper-citation').value = '';
}

function renderPapers() {
  paperList.innerHTML = '';
    const paperIndex = document.getElementById('paper-index');
  paperIndex.innerHTML = '<h3>資料リスト</h3>';

  const indexList = document.createElement('ul');
  indexList.className = 'index-list';

  papers.forEach(function(paper) {
    const li = document.createElement('li');
    li.innerHTML = `<a href="#paper-${paper.id}">${paper.title}</a>`;
    indexList.appendChild(li);
  });

  paperIndex.appendChild(indexList);

  papers.forEach(function(paper) {
    const card = document.createElement('div');
    card.className = 'paper-card';
    card.id = `paper-${paper.id}`;

    const isGoogleDoc = paper.url && paper.url.includes('docs.google.com');
    const embedUrl    = isGoogleDoc
      ? paper.url.replace('/edit', '/preview')
      : '';

const urlHTML = isGoogleDoc
  ? `<div class="paper-embed-wrapper">
       <a href="${paper.url}" target="_blank" class="paper-open-btn">↗ ドキュメントを開く</a>
       <iframe src="${embedUrl}" class="paper-embed" allowfullscreen></iframe>
     </div>`
  : paper.url
    ? `<a href="${paper.url}" target="_blank" class="paper-url">🔗 ${paper.url}</a>`
    : '';

    card.innerHTML = `
      <div class="paper-header">
        <div class="paper-title">${paper.title}</div>
        <button class="paper-delete-btn" data-id="${paper.id}">削除</button>
      </div>
      ${urlHTML}
      ${paper.memo   ? `<div class="paper-section"><span class="label">要旨</span>${paper.memo}</div>` : ''}
      ${paper.reason ? `<div class="paper-section"><span class="label">読んだ目的</span>${paper.reason}</div>` : ''}
      ${paper.citation ? `<div class="paper-section"><span class="label">引用</span>${paper.citation}</div>` : ''}
      <div class="paper-date">${paper.date}</div>
    `;

    card.querySelector('.paper-delete-btn').addEventListener('click', function(event) {
      const id = Number(event.target.dataset.id);
      deletePaper(id);
    });

    paperList.appendChild(card);
  });
}

function deletePaper(id) {
  const index = papers.findIndex(p => p.id === id);
  papers.splice(index, 1);
  renderPapers();
  saveData();
}

// ===== 共通ユーティリティ =====
function getDateStr() {
  const now = new Date();
  return now.getFullYear() + '/'
    + pad(now.getMonth() + 1) + '/'
    + pad(now.getDate()) + ' '
    + pad(now.getHours()) + ':'
    + pad(now.getMinutes());
}

function pad(num) {
  return String(num).padStart(2, '0');
}



// ===== データの保存・読み込み =====

// データを保存する
function saveData() {
  localStorage.setItem('papers', JSON.stringify(papers));
  localStorage.setItem('memos',  JSON.stringify(memos));
}

// メモ一覧を画面に描画する関数
function renderMemos() {
  memoList.innerHTML = '';

  memos.forEach(function(memo) {
    const li = document.createElement('li');
    li.className = 'memo-item';
    li.innerHTML = `
      <div class="memo-text">${memo.text}</div>
      <div class="memo-date">${memo.date}</div>
      <button class="memo-delete-btn">削除</button>
    `;

    const deleteBtn = li.querySelector('.memo-delete-btn');
    deleteBtn.addEventListener('click', function(){
      const index = memos.findIndex(m => m.id === memo.id);
      memos.splice(index, 1);
      li.remove();
      saveData();
    });

    memoList.appendChild(li);
  });
}

// データを読み込む
function loadData() {
  const savedPapers = localStorage.getItem('papers');
  const savedMemos  = localStorage.getItem('memos');

  // 保存されたデータがあれば読み込む
  if (savedPapers) {
    const parsed = JSON.parse(savedPapers);
    papers.push(...parsed);
    renderPapers();
  }


  if (savedMemos) {
    const parsed = JSON.parse(savedMemos);
    memos.push(...parsed);
    renderMemos();
  }
}

loadData();

