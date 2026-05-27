/* ============================================================
   Greenly LP — interactions (vanilla JS, no framework)
   カート / カルーセル / プラン切替 / FAQ / ハンバーガー /
   ヘッダー影 / スクロールリビール / 画像フォールバック
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 小さなヘルパ ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const yen = (n) => "¥" + n.toLocaleString("ja-JP");
  const ICON = {
    arrowR: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
    bag: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    check: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 6 9 17l-5-5"/></svg>',
    plus: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14"/></svg>',
    bagBig: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" style="color:var(--sage);opacity:.6"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.82 6.2 20.86l1.11-6.46-4.7-4.58 6.49-.94z"/></svg>'
  };

  /* ---------- 商品イラスト(画像フォールバック) ---------- */
  const ILL = {
    granola: '<svg viewBox="0 0 200 200" fill="none"><ellipse cx="100" cy="140" rx="80" ry="14" fill="#a89e85" fill-opacity="0.35"/><path d="M22 134 Q24 172 100 174 Q176 172 178 134 Z" fill="#e7dcc6"/><ellipse cx="100" cy="132" rx="74" ry="10" fill="#c2a675"/><circle cx="74" cy="126" r="3.5" fill="#52334e"/><circle cx="118" cy="125" r="3.5" fill="#52334e"/><circle cx="96" cy="128" r="3" fill="#b53c45"/><path d="M132 116 Q142 110 144 102 Q138 108 132 116" fill="#7E8D67"/></svg>',
    soup: '<svg viewBox="0 0 200 200" fill="none"><ellipse cx="100" cy="145" rx="82" ry="14" fill="#a89e85" fill-opacity="0.3"/><path d="M18 138 Q20 178 100 180 Q180 178 182 138 Z" fill="#f1e8d3"/><ellipse cx="100" cy="135" rx="72" ry="8" fill="#e5b06b"/><circle cx="70" cy="132" r="6" fill="#c25a3a"/><rect x="92" y="128" width="14" height="8" rx="2" fill="#e07a5f"/><circle cx="124" cy="131" r="5" fill="#f0d27a"/><circle cx="110" cy="135" r="4" fill="#7E8D67"/></svg>',
    cookie: '<svg viewBox="0 0 200 200" fill="none"><ellipse cx="100" cy="155" rx="82" ry="10" fill="#a89e85" fill-opacity="0.3"/><ellipse cx="100" cy="116" rx="74" ry="32" fill="#ede0c4"/><ellipse cx="70" cy="108" rx="26" ry="18" fill="#c4904c"/><circle cx="62" cy="104" r="2.5" fill="#6a3f1a"/><circle cx="80" cy="112" r="2.5" fill="#6a3f1a"/><ellipse cx="120" cy="116" rx="28" ry="20" fill="#bd8442"/><circle cx="112" cy="110" r="2.5" fill="#5e3a18"/><ellipse cx="92" cy="126" rx="26" ry="18" fill="#b88040"/></svg>',
    fruit: '<svg viewBox="0 0 200 200" fill="none"><ellipse cx="100" cy="150" rx="82" ry="12" fill="#a89e85" fill-opacity="0.3"/><path d="M22 142 Q24 178 100 180 Q176 178 178 142 Z" fill="#e9dcc0"/><ellipse cx="100" cy="140" rx="74" ry="10" fill="#f0d8a2"/><ellipse cx="62" cy="132" rx="10" ry="6" fill="#7a3a1f" transform="rotate(-15 62 132)"/><ellipse cx="80" cy="128" rx="9" ry="6" fill="#9e4a26" transform="rotate(20 80 128)"/><ellipse cx="100" cy="130" rx="11" ry="7" fill="#7a3a1f"/><ellipse cx="120" cy="128" rx="9" ry="6" fill="#9e4a26" transform="rotate(15 120 128)"/><ellipse cx="140" cy="132" rx="10" ry="6" fill="#7a3a1f" transform="rotate(-20 140 132)"/></svg>'
  };

  /* ---------- データ ---------- */
  const U = (id) => `https://images.unsplash.com/photo-${id}?w=720&q=80&auto=format&fit=crop`;
  const PRODUCTS = [
    { id: "granola", name: "オーガニックグラノーラ", en: "Organic Granola", cat: "朝の食卓へ", body: "有機オーツ麦とナッツの香ばしさ。朝食をやさしく彩る定番人気。", price: 1280, tag: { kind: "tag-butter", label: "無添加・オーガニック" }, ill: "granola", bg: "#ede1c2", photos: [U("1686182689848-283fdd34e72f"), U("1505252585461-04db1eb84625")], stamp: true, rating: 4.8, reviews: 124, badge: { kind: "badge-hot", label: "人気No.1" } },
    { id: "soup", name: "季節の野菜スープ", en: "Seasonal Vegetable Soup", cat: "あたたかな一品", body: "国産野菜をたっぷり使用。素材そのままのやさしい味わい。", price: 980, tag: { kind: "tag-sage", label: "国産野菜100%" }, ill: "soup", bg: "#e9e0c5", photos: [U("1560684352-8497838a2229")], rating: 4.6, reviews: 89 },
    { id: "cookie", name: "米粉のオートミールクッキー", en: "Rice Flour Oat Cookies", cat: "やさしいおやつ", body: "小麦粉・卵・乳製品不使用。ざくざく食感のやさしいおやつ。", price: 680, tag: { kind: "tag-sage", label: "アレルゲンフリー" }, ill: "cookie", bg: "#eee2c7", photos: [U("1499636136210-6f4ee915583e"), U("1558961363-fa8fdf82db35")], rating: 4.9, reviews: 156, badge: { kind: "badge-low", label: "残りわずか" } },
    { id: "fruit", name: "オーガニックドライフルーツ", en: "Organic Dried Fruits", cat: "自然の甘さ", body: "砂糖・保存料不使用。素材の甘みをギュッと凝縮しました。", price: 880, tag: { kind: "tag-butter", label: "砂糖不使用" }, ill: "fruit", bg: "#ece1c4", photos: [U("1641291361624-38b69b86b1cf"), U("1607664608695-45aaa6d621fc")], rating: 4.5, reviews: 73 }
  ];

  const UA = (id) => `https://images.unsplash.com/photo-${id}?w=200&h=200&q=80&auto=format&fit=crop&crop=faces`;
  const VOICES = [
    { quote: "毎朝の楽しみになりました！", body: "素材のやさしい甘さと香ばしさで、グラノーラが毎朝の楽しみに。子どもにも安心して食べさせられるのが嬉しいです。", who: "東京都　M.Yさん（34歳）", color: "#A3B18A", photo: UA("1606406054219-619c4c2e2100"), rating: 5.0 },
    { quote: "体調が整ってきた気がします", body: "無添加のスープを続けていたら、お通じが良くなり、肌の調子も整ってきました。体が喜んでいるのを感じます。", who: "神奈川県　A.Kさん（38歳）", color: "#E07A5F", photo: UA("1605501218769-dd46efd48417"), rating: 4.5 },
    { quote: "ギフトにも喜ばれました", body: "ナチュラルなパッケージも素敵で、プレゼントにぴったり。友人にもとても喜ばれました。", who: "大阪府　R.Sさん（40歳）", color: "#D4A256", photo: UA("1624091844772-554661d10173"), rating: 4.5 },
    { quote: "離乳食づくりの強い味方です", body: "アレルゲンや添加物を気にせず使えるので、赤ちゃんのごはんづくりにも安心。素材の味がしっかりしています。", who: "福岡県　S.Hさん（32歳）", color: "#7E8D67", photo: UA("1536291734366-71f75ba1a9db"), rating: 5.0 },
    { quote: "家族みんなのお気に入りに", body: "夫も子どもも気に入ってリピートしています。健康的なだけでなく、本当に美味しいのが続けられる理由です。", who: "愛知県　Y.Mさん（41歳）", color: "#C66247", photo: UA("1526746161-2ed96de67b9f"), rating: 4.5 }
  ];

  const PLANS = {
    monthly: { label: "毎月お届けコース", items: "7〜9点セット", price: 4980, badge: "人気No.1", off: "15% OFF" },
    bimonth: { label: "2ヶ月に1回お届けコース", items: "5〜7点セット", price: 3680, badge: null, off: "10% OFF" },
    trial: { label: "お試しスタートセット", items: "3点厳選セット", price: 1980, badge: "初回限定", off: "20% OFF" }
  };

  /* ---------- 星評価（5段階・小数を幅マスクで表現） ---------- */
  function renderStars(rating) {
    const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
    const five = ICON.star + ICON.star + ICON.star + ICON.star + ICON.star;
    return (
      '<span class="stars" aria-hidden="true">' +
        '<span class="stars-empty">' + five + '</span>' +
        '<span class="stars-fill" style="width:' + pct + '%">' + five + '</span>' +
      '</span>'
    );
  }

  /* =========================================================
     商品カードのレンダリング
     ========================================================= */
  function renderProducts() {
    const grid = $("#productGrid");
    if (!grid) return;
    grid.innerHTML = PRODUCTS.map((p, i) => {
      const no = String(i + 1).padStart(2, "0");
      const stamp = p.stamp
        ? '<div class="menu-stamp"><div class="stamp" style="--rot:-12deg;width:58px;height:58px"><svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true"><defs><path id="arc-' + p.id + '" d="M 12 50 A 38 38 0 0 1 88 50"/></defs><circle cx="50" cy="50" r="44" fill="none" stroke="#E07A5F" stroke-width="1.3" stroke-dasharray="0.3 1.6" opacity="0.85"/><text font-family="Lora,serif" font-size="8" font-style="italic" fill="#E07A5F" letter-spacing="0.18em" font-weight="600"><textPath href="#arc-' + p.id + '" startOffset="50%" text-anchor="middle">ORGANIC</textPath></text></svg><span class="stamp-main" style="color:#E07A5F;font-size:13px">100%</span></div></div>'
        : "";
      const badge = p.badge
        ? '<span class="menu-badge ' + p.badge.kind + '">' + p.badge.label + '</span>'
        : "";
      const rating = (typeof p.rating === "number")
        ? '<div class="menu-rating" role="img" aria-label="5段階中 ' + p.rating.toFixed(1) + '、レビュー' + p.reviews + '件">' +
            renderStars(p.rating) +
            '<span class="rating-score">' + p.rating.toFixed(1) + '</span>' +
            '<span class="rating-count">(' + p.reviews + ')</span>' +
          '</div>'
        : "";
      return (
        '<article class="menu-card">' +
          '<div class="menu-chapter"><span class="menu-no">No.' + no + '</span><span class="menu-rule"></span><span class="menu-cat">' + p.cat + '</span></div>' +
          '<div class="menu-photo-wrap">' +
            '<div class="menu-photo" style="background:linear-gradient(135deg,' + p.bg + ' 0%,#e2d3b0 100%)">' +
              ILL[p.ill] +
              '<img alt="' + p.name + '" data-photos=\'' + JSON.stringify(p.photos) + '\'>' +
              stamp +
              '<svg class="menu-photo-frame" viewBox="0 0 200 220" preserveAspectRatio="none" fill="none" aria-hidden="true"><path d="M 4 216 L 4 100 Q 4 4 100 4 Q 196 4 196 100 L 196 216" stroke="rgba(126,141,103,0.45)" stroke-width="1" fill="none"/></svg>' +
            '</div>' +
            badge +
          '</div>' +
          '<div class="menu-body">' +
            '<span class="tag ' + p.tag.kind + '">' + p.tag.label + '</span>' +
            '<h3 class="menu-title">' + p.name + '</h3>' +
            '<div class="menu-en">— ' + p.en + ' —</div>' +
            rating +
            '<p class="menu-desc">' + p.body + '</p>' +
            '<div class="menu-divider"><span></span><svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2 Q14 8 10 18 Q6 8 10 2" fill="#A3B18A" opacity="0.7"/></svg><span></span></div>' +
            '<div class="menu-price-row">' +
              '<span class="menu-price"><span class="yen">¥</span>' + p.price.toLocaleString() + '<span class="tax">(税込)</span></span>' +
              '<span class="menu-leader"></span>' +
              '<button class="menu-cart-btn" data-id="' + p.id + '" data-name="' + p.name + '" data-price="' + p.price + '" data-ill="' + p.ill + '" aria-label="' + p.name + ' をカートに追加">' + ICON.bag + '</button>' +
            '</div>' +
          '</div>' +
        '</article>'
      );
    }).join("");

    // 画像フォールバックの設定
    $$("#productGrid .menu-photo img").forEach(setupSmartImg);

    // カート追加
    $$("#productGrid .menu-cart-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        addToCart({ id: btn.dataset.id, name: btn.dataset.name, price: Number(btn.dataset.price), ill: btn.dataset.ill });
        btn.classList.add("pressed");
        btn.innerHTML = ICON.check;
        setTimeout(() => { btn.classList.remove("pressed"); btn.innerHTML = ICON.bag; }, 700);
      });
    });
  }

  // 画像をチェーンで試し、全滅したら img を消してイラストを見せる
  function setupSmartImg(img) {
    let urls;
    try { urls = JSON.parse(img.dataset.photos || "[]"); } catch (e) { urls = []; }
    let i = 0;
    const tryNext = () => {
      if (i >= urls.length) { img.remove(); return; }
      img.src = urls[i++];
    };
    img.addEventListener("error", tryNext);
    tryNext();
  }

  /* =========================================================
     お客様の声カルーセル
     ========================================================= */
  function setupVoice() {
    const grid = $("#voiceGrid");
    if (!grid) return;

    function cardHTML(v) {
      const avatar = v.photo
        ? '<div class="avatar" style="background:linear-gradient(135deg,' + v.color + ' 0%,' + v.color + 'cc 100%)"><img src="' + v.photo + '" alt="" onerror="this.style.display=\'none\'"></div>'
        : '<div class="avatar" style="background:linear-gradient(135deg,' + v.color + ' 0%,' + v.color + 'cc 100%)">' + v.quote.charAt(0) + '</div>';
      return (
        '<article class="voice-card">' +
          '<svg class="voice-corner voice-corner-tr" viewBox="0 0 80 80" fill="none" aria-hidden="true"><path d="M40 76 Q44 52 50 28" stroke="#7E8D67" stroke-width="1" stroke-linecap="round"/><path d="M50 28 Q58 22 64 28" stroke="#7E8D67" stroke-width="1" stroke-linecap="round"/><g transform="translate(50 28)"><ellipse cx="0" cy="-5" rx="2.2" ry="4.5" fill="#F0D27A" opacity="0.85"/><ellipse cx="0" cy="-5" rx="2.2" ry="4.5" fill="#F0D27A" opacity="0.85" transform="rotate(72)"/><ellipse cx="0" cy="-5" rx="2.2" ry="4.5" fill="#F0D27A" opacity="0.85" transform="rotate(144)"/><ellipse cx="0" cy="-5" rx="2.2" ry="4.5" fill="#F0D27A" opacity="0.85" transform="rotate(216)"/><ellipse cx="0" cy="-5" rx="2.2" ry="4.5" fill="#F0D27A" opacity="0.85" transform="rotate(288)"/><circle r="2" fill="#E07A5F"/></g></svg>' +
          '<svg class="voice-corner voice-corner-bl" viewBox="0 0 60 70" fill="none" aria-hidden="true"><path d="M12 4 Q14 30 8 64" stroke="#A3B18A" stroke-width="1" stroke-linecap="round" opacity="0.7"/><ellipse cx="6" cy="20" rx="5" ry="2" transform="rotate(-40 6 20)" fill="#A3B18A" opacity="0.45"/><ellipse cx="18" cy="32" rx="5" ry="2" transform="rotate(35 18 32)" fill="#A3B18A" opacity="0.5"/></svg>' +
          '<span class="voice-q-mark" aria-hidden="true">&ldquo;</span>' +
          '<div class="voice-head">' + avatar + '<h3 class="voice-title">' + v.quote + '</h3></div>' +
          (typeof v.rating === "number" ? '<div class="voice-rating" role="img" aria-label="5段階中 ' + v.rating.toFixed(1) + '">' + renderStars(v.rating) + '</div>' : '') +
          '<p class="voice-body">' + v.body + '</p>' +
          '<div class="voice-foot">' + v.who + '</div>' +
        '</article>'
      );
    }

    // 連続スクロール（マーキー）。継ぎ目をなくすため同じ並びを2セット連結し、
    // CSS アニメーションで全体を -50%（＝1セット分）ゆっくり左へ流す
    const seq = VOICES.concat(VOICES);
    grid.innerHTML = seq.map(cardHTML).join("");
    // 複製分は支援技術に重複読み上げさせない
    $$(".voice-card", grid).forEach((c, i) => { if (i >= VOICES.length) c.setAttribute("aria-hidden", "true"); });

    // ホバー / フォーカスで一時停止（読みたいときに止められる）
    const vp = $(".voice-viewport");
    const setPlay = (s) => { grid.style.animationPlayState = s; };
    ["mouseenter", "focusin"].forEach((ev) => vp.addEventListener(ev, () => setPlay("paused")));
    ["mouseleave", "focusout"].forEach((ev) => vp.addEventListener(ev, () => setPlay("running")));
  }

  /* =========================================================
     定期購入プラン切替
     ========================================================= */
  function setupPlans() {
    const picks = $$(".plan-pick");
    if (!picks.length) return;
    const addBtn = $("#planAdd");

    function select(key) {
      const p = PLANS[key];
      picks.forEach((el) => {
        const on = el.dataset.plan === key;
        el.classList.toggle("active", on);
        const input = $("input", el);
        if (input) input.checked = on;
      });
      $("#planLabel").textContent = p.label;
      $("#planItems").textContent = "（" + p.items + "）";
      $("#planOff").textContent = p.off;
      $("#planPrice").textContent = yen(p.price);
      const badge = $("#planBadge");
      if (p.badge) { badge.hidden = false; badge.textContent = p.badge + "　おすすめプラン"; }
      else { badge.hidden = true; }
      addBtn.dataset.plan = key;
    }

    picks.forEach((el) => {
      el.addEventListener("click", () => select(el.dataset.plan));
      const input = $("input", el);
      if (input) input.addEventListener("change", () => select(el.dataset.plan));
    });

    addBtn.addEventListener("click", () => {
      const key = addBtn.dataset.plan || "monthly";
      const p = PLANS[key];
      addToCart({ id: "plan-" + key, name: "【定期】" + p.label, price: p.price, ill: "granola" });
    });

    select("monthly");
  }

  /* =========================================================
     FAQ アコーディオン（単一開閉）
     ========================================================= */
  function setupFAQ() {
    const items = $$(".faq-item");
    items.forEach((item) => {
      const btn = $(".faq-q", item);
      btn.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        // 単一開閉：他を閉じる
        items.forEach((other) => {
          other.classList.remove("open");
          $(".faq-q", other).setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* =========================================================
     カート
     ========================================================= */
  const cart = []; // { id, name, price, ill, qty }

  function cartCount() { return cart.reduce((s, i) => s + i.qty, 0); }
  function cartSubtotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }

  function addToCart(product) {
    const ex = cart.find((i) => i.id === product.id);
    if (ex) ex.qty += 1;
    else cart.push(Object.assign({ qty: 1 }, product));
    updateBadge(true);
    renderCart();
    showToast("「" + product.name + "」をカートに追加しました");
  }
  function setQty(id, qty) {
    if (qty < 1) return;
    const it = cart.find((i) => i.id === id);
    if (it) { it.qty = qty; updateBadge(false); renderCart(); }
  }
  function removeItem(id) {
    const idx = cart.findIndex((i) => i.id === id);
    if (idx >= 0) { cart.splice(idx, 1); updateBadge(false); renderCart(); }
  }

  function updateBadge(pop) {
    const badge = $("#cartBadge");
    const n = cartCount();
    badge.textContent = n;
    badge.hidden = n === 0;
    if (pop && n > 0) { badge.classList.remove("pop"); void badge.offsetWidth; badge.classList.add("pop"); }
    const cc = $("#cartCount");
    cc.hidden = n === 0;
    cc.textContent = n + "点";
  }

  function renderCart() {
    const body = $("#cartBody");
    if (cart.length === 0) {
      body.innerHTML =
        '<div class="empty-cart">' + ICON.bagBig +
        '<h4 style="margin:16px 0 0;font-family:var(--font-serif-jp);color:var(--ink-1);font-size:17px">カートは空です</h4>' +
        '<p style="margin:8px 0 0;font-size:13px;color:var(--ink-3);line-height:1.8">気になる商品を見つけて、<br>カートに追加してみましょう。</p></div>';
      return;
    }
    const items = cart.map((i) => (
      '<div class="cart-item">' +
        '<div class="ci-thumb">' + (ILL[i.ill] || ICON.bag) + '</div>' +
        '<div style="min-width:0"><div class="ci-name">' + i.name + '</div><div class="ci-price">' + yen(i.price * i.qty) + '</div></div>' +
        '<div class="ci-side">' +
          '<div class="qty-ctrl">' +
            '<button data-act="dec" data-id="' + i.id + '"' + (i.qty <= 1 ? " disabled" : "") + ' aria-label="数量を減らす">' + ICON.minus + '</button>' +
            '<span>' + i.qty + '</span>' +
            '<button data-act="inc" data-id="' + i.id + '" aria-label="数量を増やす">' + ICON.plus + '</button>' +
          '</div>' +
          '<button class="ci-remove" data-act="rm" data-id="' + i.id + '">削除</button>' +
        '</div>' +
      '</div>'
    )).join("");

    body.innerHTML =
      '<div class="cart-items">' + items + '</div>' +
      '<footer>' +
        '<div class="cart-subtotal"><span class="lbl">小計（税込）</span><span class="val">' + yen(cartSubtotal()) + '</span></div>' +
        '<div class="cart-note">' + ICON.check + '¥3,000以上のご注文で送料無料</div>' +
        '<button class="btn btn-primary" style="width:100%">ご購入手続きへ ' + ICON.arrowR + '</button>' +
        '<button class="btn-link" id="keepShopping" style="width:100%;justify-content:center;margin-top:8px">買い物を続ける</button>' +
      '</footer>';

    $$("#cartBody [data-act]").forEach((btn) => {
      const id = btn.dataset.id;
      const it = cart.find((x) => x.id === id);
      btn.addEventListener("click", () => {
        if (btn.dataset.act === "inc") setQty(id, it.qty + 1);
        else if (btn.dataset.act === "dec") setQty(id, it.qty - 1);
        else removeItem(id);
      });
    });
    const keep = $("#keepShopping");
    if (keep) keep.addEventListener("click", closeCart);
  }

  /* ---------- ドロワー開閉（フォーカス管理 + inert） ---------- */
  const drawer = $("#cartDrawer");
  const overlay = $("#cartOverlay");
  let lastFocus = null;

  function openCart() {
    lastFocus = document.activeElement;
    drawer.classList.add("open");
    overlay.classList.add("open");
    drawer.removeAttribute("inert");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $("#cartClose").focus();
  }
  function closeCart() {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    drawer.setAttribute("inert", "");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ---------- トースト ---------- */
  let toastTimer = null;
  function showToast(msg) {
    const t = $("#toast");
    $("#toastMsg").textContent = msg;
    t.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
  }

  /* =========================================================
     ヘッダー / ハンバーガー / リビール / ヒーロー画像
     ========================================================= */
  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function setupHeader() {
    const header = $("#siteHeader");
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // ハンバーガー
    const toggle = $("#menuToggle");
    const nav = $("#mobileNav");
    function setMenu(open) {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
      document.body.style.overflow = open ? "hidden" : "";
    }
    toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
    $$("#mobileNav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
    // リサイズでデスクトップに戻ったら閉じる
    window.addEventListener("resize", () => { if (window.innerWidth > 768) setMenu(false); });
  }

  function setupCartControls() {
    $("#cartBtn").addEventListener("click", openCart);
    $("#cartClose").addEventListener("click", closeCart);
    overlay.addEventListener("click", closeCart);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (drawer.classList.contains("open")) closeCart();
        const nav = $("#mobileNav");
        if (nav.classList.contains("open")) { nav.classList.remove("open"); $("#menuToggle").setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; }
      }
    });
    drawer.setAttribute("inert", ""); // 初期は閉
    renderCart();
    updateBadge(false);
  }

  function setupReveal() {
    const els = $$(".reveal, .reveal-stagger");
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => obs.observe(el));
  }

  function setupHeroImg() {
    const img = $("#heroImg");
    if (!img) return;
    let usedFallback = false;
    img.addEventListener("error", () => {
      if (!usedFallback && img.dataset.fallback) { usedFallback = true; img.src = img.dataset.fallback; }
      else { img.style.display = "none"; } // グラデ背景にフォールバック
    });
  }

  /* =========================================================
     init
     ========================================================= */
  document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    setupVoice();
    setupPlans();
    setupFAQ();
    setupHeader();
    setupCartControls();
    setupReveal();
    setupHeroImg();
  });
})();
