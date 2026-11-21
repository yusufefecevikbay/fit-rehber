/* ==========================================================================
   FitRehber - Ana JavaScript Dosyası (Saf Vanilla JS)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    initLibraryPage();
});

/**
 * Türkçe karakterleri İngilizce karşılıklarına dönüştürür ve metni aramaya hazırlar.
 * Örn: "Göğüs" -> "gogus", "Sırt" -> "sirt", "Köfte" -> "kofte"
 */
function normalizeText(text) {
    if (!text) {
        return "";
    }

    return text
        .toLocaleLowerCase("tr-TR")
        .replace(/\u0307/g, "")
        .replace(/ı/g, "i")
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * Kategorilere özel akıllı arama anahtar kelimeleri.
 */
const CATEGORY_KEYWORDS = {
    egzersiz: ["egzersiz", "spor", "antrenman", "hareket", "fitness"],
    tarif: ["yemek", "tarif", "beslenme", "protein", "ogun", "mutfak"]
};

/**
 * 16 kartın tamamı için detay ekranında (modal) gösterilecek ekstra bilgiler.
 * Anahtarlar normalize edilmiş kart başlığı önekleriyle eşleştirilir.
 */
const CARD_EXTRA_DETAILS = {
    // ================= 8 EGZERSİZ KARTI =================
    "lateral raise ve dumbbell fly": {
        type: "egzersiz",
        setsReps: "3-4 Set x 12-15 Tekrar • Dinlenme: 60 saniye",
        muscles: "Ana: Yan Omuz (Lateral Deltoid) • Yardımcı: Ön Omuz, Üst Trapez, Supraspinatus",
        steps: [
            "Ayaklarını omuz genişliğinde aç, dizlerini hafifçe yumuşat ve gövdeni dik konumda sabitle.",
            "Dambılları yanlarda tutarken dirseklerini yaklaşık 15-20 derece bükülü kilitle.",
            "Ağırlıkları omuz hizasına kadar yavaşça kaldır; kolların yere paralel olduğunda 1 saniye bekle.",
            "Omuz kasındaki gerginliği koruyarak 2-3 saniyede kontrollü şekilde başlangıç noktasına indir."
        ],
        tip: "Püf Noktası: Hareketi elinle değil dirseklerinle yönlendir; dambılları hafifçe öne doğru 15 derece açıyla kaldırmak omuz eklemini rahatlatır."
    },

    "overhead press": {
        type: "egzersiz",
        setsReps: "4 Set x 6-10 Tekrar • Dinlenme: 90-120 saniye",
        muscles: "Ana: Ön ve Yan Omuz (Deltoid) • Yardımcı: Üst Göğüs, Triceps, Core (Karın)",
        steps: [
            "Barı omuz genişliğinden biraz daha geniş kavra ve köprücük kemiğinin hemen önüne yerleştir.",
            "Karın ve kalça kaslarını sıkıp derin bir nefes alarak gövdeni çelik gibi sabitle.",
            "Çeneni hafifçe geri çekerek barı dikey ve düz bir çizgide başının üstüne doğru it.",
            "Bar baş hizasını geçince gövdeni hafifçe barın altına al ve tepe noktada omuzları aktif kilitle."
        ],
        tip: "Püf Noktası: Dirseklerin barın hemen altında ve hafif önde dursun; bu açı bilek ve omuz eklemine binen gereksiz stresi ortadan kaldırır."
    },

    "lat pulldown ve barfiks": {
        type: "egzersiz",
        setsReps: "4 Set x 8-12 Tekrar (Barfikste tükenişe 1-2 tekrar kala) • Dinlenme: 90 saniye",
        muscles: "Ana: Kanat Kası (Latissimus Dorsi) • Yardımcı: Biceps, Arka Omuz, Orta Sırt",
        steps: [
            "Barı omuz genişliğinin yaklaşık 1.5 katı genişlikte kavra ve göğsünü hafifçe tavana doğru aç.",
            "Çekişe başlamadan önce omuzlarını kulaklarından uzaklaştırarak kürek kemiklerini aşağı bastır.",
            "Dirseklerini yanlara değil doğrudan beline ve kalçana doğru çekerek barı üst göğüs hizasına indir.",
            "Tepe noktada sırt kaslarını 1 saniye sıkıştır, ardından kollarını kontrollü biçimde tam yukarı uzat."
        ],
        tip: "Püf Noktası: Başparmaklarını barın üstüne koyarak (thumbless grip) tutmak, ön kol ve biceps devreye girmeden sırtını çok daha iyi hissetmeni sağlar."
    },

    "barbell row": {
        type: "egzersiz",
        setsReps: "4 Set x 8-10 Tekrar • Dinlenme: 90-120 saniye",
        muscles: "Ana: Orta Sırt, Rhomboid, Kanat (Latissimus Dorsi) • Yardımcı: Arka Omuz, Trapez, Alt Sırt, Biceps",
        steps: [
            "Ayaklarını kalça genişliğinde aç, dizlerini hafif kır ve sırtını düz tutarak gövdeni yere 35-45 derece eğ.",
            "Barı omuz genişliğinde kavra; kolların yere dik asılıyken karın kaslarını sıkıp belini sabitle.",
            "Barı uyluklarına yakın bir çizgide göbek deliği hizasına doğru çek ve kürek kemiklerini birbirine yaklaştır.",
            "Üst pozisyonda kısa bir duraklama yapıp barı sırtının gerginliğini kaybetmeden yavaşça aşağı indir."
        ],
        tip: "Püf Noktası: Boynunu yukarı kaldırıp aynaya bakmak yerine bakışlarını yere yaklaşık 1.5 metre öne sabitle; böylece omurga doğal hizasında kalır."
    },

    "bench press ve sinav": {
        type: "egzersiz",
        setsReps: "4 Set x 8-12 Tekrar (Şınavda 3-4 Set x 12-20 Tekrar) • Dinlenme: 90-120 saniye",
        muscles: "Ana: Göğüs Kasları (Pektoralis Majör) • Yardımcı: Ön Omuz, Arka Kol (Triceps)",
        steps: [
            "Sırt üstü uzandığında ayak tabanlarını yere sağlam bas, kürek kemiklerini geriye ve aşağı doğru sehpaya kilitle.",
            "Barı veya ellerini göğüs çizgisinin hafif dışında konumlandır ve bileklerini dik hizada tut.",
            "Dirseklerini gövdenle 45 derece açıda tutarak ağırlığı göğüs kafesinin alt-orta çizgisine kontrollü indir.",
            "Göğüs kaslarını hissederek barı hafif çapraz bir yörüngeyle yukarı it ve nefesi itişin üst kısmında ver."
        ],
        tip: "Püf Noktası: Barı sanki ortadan ikiye büküyormuşsun gibi kavramak sırt kaslarını aktive eder ve omuz stabiliteni belirgin biçimde artırır."
    },

    "squat ve lunge": {
        type: "egzersiz",
        setsReps: "4 Set x 8-10 Tekrar (Lunge için bacak başına 10-12 Tekrar) • Dinlenme: 120 saniye",
        muscles: "Ana: Ön Bacak (Quadriceps) ve Kalça (Gluteus) • Yardımcı: Arka Bacak, İç Bacak, Core",
        steps: [
            "Ayaklarını omuz genişliğinde açıp parmak uçlarını hafifçe dışa çevir; ağırlığı tüm ayak tabanına eşit dağıt.",
            "Derin bir nefes alıp karnını şişirerek sık (bracing), ardından kalçanı geriye ve aşağı doğru indir.",
            "Uylukların yere paralel veya bir tık altına inene kadar sırt açını bozmadan kontrollü alçal.",
            "Topuklarından ve ayak ortasından yeri iterek güçlü biçimde yüksel; tepe noktada kalçayı hafifçe sık."
        ],
        tip: "Püf Noktası: Lunge yaparken adımlarını tek bir çizgide değil ray üzerinde gibi iki paralel hatta at; denge sorunun anında çözülür."
    },

    "biceps curl ve triceps pushdown": {
        type: "egzersiz",
        setsReps: "3-4 Set x 10-15 Tekrar • Dinlenme: 60 saniye",
        muscles: "Ana: Ön Kol (Biceps Brachii) ve Arka Kol (Triceps Brachii) • Yardımcı: Brachialis, Ön Kol Bilek Kasları",
        steps: [
            "Gövdeni dik tut, omuzlarını geride sabitle ve üst kollarını kaburgalarının hemen yanında hareketsiz bırak.",
            "Biceps curl'de avuç içleri yukarı bakacak şekilde ağırlığı omuz hizasına kaldır ve tepe noktada 1 saniye sık.",
            "Triceps pushdown'da kablo barını veya halatı kalça hizasına doğru aşağı itip dirsekleri tam aç.",
            "Her iki harekette de başlangıç pozisyonuna dönüşü 2-3 saniyeye yayarak negatif gerilimden tam faydalan."
        ],
        tip: "Püf Noktası: Son tekrarlarda belden sallanmak yerine ağırlığı bir kademe düşürüp tam hareket açıklığıyla çalışmak çok daha hızlı kas gelişimi sağlar."
    },

    "plank ve hanging leg raise": {
        type: "egzersiz",
        setsReps: "Plank: 3 Set x 45-60 sn • Leg Raise: 3 Set x 10-15 Tekrar • Dinlenme: 60 saniye",
        muscles: "Ana: Rektus Abdominis (Karın) ve Transversus Abdominis • Yardımcı: Oblikler, Ön Kol, Kalça Fleksörleri",
        steps: [
            "Plankta dirseklerini tam omuzlarının altına koy; kalçanı sıkıp göbek deliğini omurgana doğru çek.",
            "Plank boyunca kısa ve kontrollü nefesler al, kalçanın ne yukarı kalkmasına ne de aşağı çökmesine izin ver.",
            "Hanging leg raise için bara sağlam tutun, omuzlarını aktif tutarak gövdenin sallanmasını durdur.",
            "Bacaklarını (veya başlangıçta dizlerini) kaldırırken kalçanı öne kıvırarak alt karın kaslarını sıkıştır."
        ],
        tip: "Püf Noktası: Plankta dirseklerini hayali olarak ayak parmaklarına doğru çekiyormuş gibi kasmak karın aktivasyonunu iki katına çıkarır."
    },

    // ================= 8 YÜKSEK PROTEİNLİ TARİF KARTI =================
    "kremali yuksek proteinli tavuklu makarna": {
        type: "tarif",
        prepTime: "Toplam 15 Dakika (5 dk hazırlık • 10 dk pişirme)",
        macros: "46g Protein • 62g Karbonhidrat • 12g Yağ • 560 kcal",
        steps: [
            "Tam buğday makarnayı kaynar ve hafif tuzlu suda 8-9 dakika al dente kıvamda haşla; süzmeden önce yarım kepçe makarna suyunu kenara ayır.",
            "Küp doğranmış tavuk göğsünü 1 tatlı kaşığı zeytinyağı, ezilmiş sarımsak, köri ve karabiber ile yüksek ateşte 5-6 dakika sotele.",
            "Tavanın altını en kısık seviyeye al; ayrı kasede makarna suyuyla pürüzsüzleştirdiğin süzme yoğurdu tavukların üzerine dök.",
            "Süzülmüş makarnayı tavaya ekleyip 1 dakika boyunca sosla tamamen bütünleşene kadar karıştır ve sıcak servis et."
        ],
        tip: "Şef İpucu: Süzme yoğurdun kesilmemesi için tavayı kısık ateşe alıp yoğurdu mutlaka sıcak makarna suyuyla ılıtarak ekle."
    },

    "firinda baharatli tavuk gogsu ve pilav": {
        type: "tarif",
        prepTime: "Toplam 20 Dakika (5 dk hazırlık • 15 dk pişirme)",
        macros: "48g Protein • 58g Karbonhidrat • 10g Yağ • 540 kcal",
        steps: [
            "Basmati pirinci nişastası gidene kadar yıka ve 1'e 1.5 ölçü sıcak su ile kısık ateşte 12 dakika demlenmeye bırak.",
            "Tavuk göğsünü eşit kalınlıkta iki filetoya böl; yoğurt, zeytinyağı, kırmızı toz biber, kekik ve sarımsak tozuyla her yerini kapla.",
            "Önceden ısıtılmış 200°C fırında (veya airfryer'da) tavukları 14-15 dakika dışı kızarıp içi sulu kalacak şekilde pişir.",
            "Pişen tavukları kesmeden önce 2 dakika dinlendir, ardından dilimleyip pilavla birlikte tabakla."
        ],
        tip: "Şef İpucu: Marinasyondaki 1 yemek kaşığı yoğurt, tavuk göğsünü fırında kurumaktan korur ve ekstra yumuşak doku kazandırır."
    },

    "fistik ezmeli ve muzlu proteinli yulaf": {
        type: "tarif",
        prepTime: "Toplam 10 Dakika (3 dk hazırlık • 7 dk pişirme)",
        macros: "34g Protein • 56g Karbonhidrat • 12g Yağ • 470 kcal",
        steps: [
            "Yulaf ezmesi, süt ve bir tutam tarçını küçük bir tencereye alıp orta-kısık ateşte karıştırarak 4-5 dakika pişir.",
            "Kıvam koyulaşınca tencereyi ocaktan al ve protein tozunun topaklanmaması için 1-2 dakika hafifçe ılınmasını bekle.",
            "Protein tozunu (veya ezilmiş lor peynirini) ekleyip kremsi doku oluşana kadar iyice karıştır.",
            "Kaseye aldıktan sonra üzerine dilimlenmiş yarım muz ve 1 tatlı kaşığı şekersiz fıstık ezmesi gezdirerek servis et."
        ],
        tip: "Şef İpucu: Daha akışkan bir kıvam seviyorsan pişirme bitiminde 2-3 yemek kaşığı soğuk süt veya su ilave edebilirsin."
    },

    "sebzeli ve yulafli fit omlet": {
        type: "tarif",
        prepTime: "Toplam 10 Dakika (4 dk hazırlık • 6 dk pişirme)",
        macros: "31g Protein • 26g Karbonhidrat • 17g Yağ • 390 kcal",
        steps: [
            "Ispanak ve kapya biberi ince ince doğra; bir kasede yumurtaları yulaf ezmesi, lor peyniri ve pul biberle çırp.",
            "Yulafın hafifçe yumuşaması için karışımı 1-2 dakika beklet ve doğranmış sebzeleri içine ekleyip karıştır.",
            "Yapışmaz tavayı 1 çay kaşığı zeytinyağıyla fırçalayıp ısıt, karışımı dök ve kapağını kapatarak kısık ateşte 3-4 dakika pişir.",
            "Alt yüzeyi kızarıp üstü toparlanınca spatula yardımıyla ters çevirip 2 dakika daha pişirerek servis tabağına al."
        ],
        tip: "Şef İpucu: Yulafı rondodan geçirip un kıvamında eklersen çok daha kabarık ve krep dokusunda pürüzsüz bir omlet elde edersin."
    },

    "avokadolu ve ton balikli pratik salata": {
        type: "tarif",
        prepTime: "Toplam 8 Dakika (Pişirme gerektirmez)",
        macros: "36g Protein • 24g Karbonhidrat • 18g Yağ • 410 kcal",
        steps: [
            "Roka ve diğer taze yeşillikleri yıkayıp süzerek geniş bir salata kasesine al, çeri domatesleri ikiye böl.",
            "Light ton balığının suyunu iyice süz; olgun avokadoyu çekirdeğinden ayırıp küp küp doğra.",
            "Haşlanmış nohut (veya mısır), avokado ve ton balığını yeşilliklerin üzerine dengeli şekilde yerleştir.",
            "Yarım limonun suyunu, bir tutam karabiberi ve isteğe bağlı nane/kekik ekleyip avokadoları ezmeden hafifçe harmanla."
        ],
        tip: "Şef İpucu: Limon suyunu özellikle avokado küplerinin üzerine sıkmak hem lezzeti parlatır hem de avokadonun kararmasını önler."
    },

    "kefirli ve orman meyveli protein smoothie": {
        type: "tarif",
        prepTime: "Toplam 5 Dakika (Pişirme gerektirmez)",
        macros: "29g Protein • 34g Karbonhidrat • 7g Yağ • 320 kcal",
        steps: [
            "Blender haznesine önce sıvı taban olarak soğuk sade kefiri dök; bu sayede bıçaklar malzemeyi kolayca kavrar.",
            "Üzerine protein tozu, donmuş orman meyveleri, 1 yemek kaşığı yulaf ve chia tohumunu ilave et.",
            "Önce düşük devirde 10 saniye, ardından yüksek devirde 30 saniye pürüzsüz ve kadifemsi kıvam alana kadar çek.",
            "Bardağa alıp bekletmeden soğuk olarak tüket; antrenman sonrası hızlı toparlanma için idealdir."
        ],
        tip: "Şef İpucu: Meyveleri donmuş kullanmak ekstra buz eklemeden milkshake kıvamında yoğun ve ferah bir içecek elde etmeni sağlar."
    },

    "izgara kofte ve kinoa bowl": {
        type: "tarif",
        prepTime: "Toplam 15 Dakika (5 dk hazırlık • 10 dk pişirme)",
        macros: "42g Protein • 46g Karbonhidrat • 17g Yağ • 520 kcal",
        steps: [
            "Yağsız dana kıymayı yulaf unu, kimyon, karabiber ve bir tutam tuzla 2 dakika yoğurup 4-5 adet yassı köfte şekli ver.",
            "Önceden ısıtılmış döküm veya yapışmaz tavada köftelerin her iki yüzünü orta-yüksek ateşte 4'er dakika pişir.",
            "Servis kasesinin tabanına haşlanmış kinoayı yay; yanına doğranmış salatalık ve közlenmiş biberleri yerleştir.",
            "Sıcak ızgara köfteleri ve 2 yemek kaşığı yoğurdu kaseye ekleyerek dengeli bir sporcu öğünü oluştur."
        ],
        tip: "Şef İpucu: Kinoayı haftanın başında topluca haşlayıp buzdolabında saklarsan bu kaseyi antrenman sonrası 10 dakikanın altında hazırlayabilirsin."
    },

    "lor peynirli ve yumurtali fit tost": {
        type: "tarif",
        prepTime: "Toplam 10 Dakika (3 dk hazırlık • 7 dk pişirme)",
        macros: "32g Protein • 36g Karbonhidrat • 13g Yağ • 400 kcal",
        steps: [
            "2 yumurtayı 100g yağsız lor peyniri, kekik, pul biber ve ince kıyılmış maydanozla bir kasede çatal yardımıyla çırp.",
            "Hafif ısıtılmış yapışmaz tavada karışımı ekmek boyutunda ince bir omlet gibi 2-3 dakika pişirip ikiye katla.",
            "Pişen proteinli lorlu omleti iki dilim tam buğday veya ekşi mayalı tost ekmeğinin arasına yerleştir.",
            "Önceden ısınmış tost makinesinde 3 dakika dışı çıtırlaşana kadar bastır ve sıcak servis et."
        ],
        tip: "Şef İpucu: Lor peynirini doğrudan ekmeğin arasına koymak yerine yumurtayla bağlayarak pişirmek hem dağılmasını önler hem de lezzeti katlar."
    }
};

/**
 * Tüm sayfalardaki ortak mobil menüyü açar ve kapatır.
 */
function initMobileMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const primaryNav = document.getElementById("primaryNav");

    // Hata koruması: Menü elemanları sayfada yoksa işlemi durdur
    if (!menuToggle || !primaryNav) {
        return;
    }

    menuToggle.addEventListener("click", () => {
        const isOpen = primaryNav.classList.toggle("is-open");
        menuToggle.classList.toggle("is-open", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    const navLinks = primaryNav.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            primaryNav.classList.remove("is-open");
            menuToggle.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && primaryNav.classList.contains("is-open")) {
            primaryNav.classList.remove("is-open");
            menuToggle.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.focus();
        }
    });
}

/**
 * Kütüphane sayfasındaki (icerikler.html) URL parametresi okuma,
 * akıllı Türkçe/İngilizce arama, kategori filtreleme ve tek sayfa detay ekranını yönetir.
 */
function initLibraryPage() {
    const searchInput = document.getElementById("event-search");
    const clearButton = document.getElementById("clear-search");
    const resultCount = document.getElementById("result-count");
    const emptyMessage = document.getElementById("empty-message");
    const eventList = document.getElementById("event-list");
    const filterButtons = document.querySelectorAll(".filter-btn");

    // Hata koruması: Kütüphane elemanları bu sayfada yoksa (index/hakkimizda) çık
    if (!searchInput || !clearButton || !resultCount || !emptyMessage || !eventList) {
        return;
    }

    const cards = Array.from(eventList.querySelectorAll("article.card"));
    let activeCategory = "all";

    /**
     * Seçili kategori butonunun aktif görünümünü günceller.
     */
    function setActiveCategoryButton(category) {
        filterButtons.forEach((btn) => {
            const btnCategory = normalizeText(btn.dataset.filter || "all");
            btn.classList.toggle("active", btnCategory === category);
        });
    }

    /**
     * URL'deki ?kategori=egzersiz veya ?kategori=tarif parametresini okur.
     */
    function applyInitialCategoryFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const urlCategory = normalizeText(params.get("kategori") || "");

        if (urlCategory === "egzersiz" || urlCategory === "tarif") {
            activeCategory = urlCategory;
            setActiveCategoryButton(activeCategory);
        }
    }

    /**
     * Kart başlığı + kategori anahtar kelimeleri üzerinden Türkçe/İngilizce uyumlu akıllı filtreleme yapar.
     */
    function applyFilters() {
        const normalizedQuery = normalizeText(searchInput.value);
        const queryWords = normalizedQuery ? normalizedQuery.split(" ") : [];
        let visibleCount = 0;

        cards.forEach((card) => {
            const cardCategory = normalizeText(card.dataset.category || "");
            const titleElement = card.querySelector("h2");
            const normalizedTitle = normalizeText(titleElement ? titleElement.textContent : "");
            const extraKeywords = CATEGORY_KEYWORDS[cardCategory] || [];

            // Başlık metni ile kategori anahtar kelimelerini birleştirip ara
            const searchableText = `${normalizedTitle} ${extraKeywords.join(" ")}`;

            const matchesCategory = activeCategory === "all" || cardCategory === activeCategory;
            const matchesSearch =
                queryWords.length === 0 ||
                queryWords.every((word) => searchableText.includes(word));

            if (matchesCategory && matchesSearch) {
                card.hidden = false;
                visibleCount += 1;
            } else {
                card.hidden = true;
            }
        });

        // Canlı sonuç sayacını ve boş sonuç uyarısını güncelle
        resultCount.textContent = `${visibleCount} içerik gösteriliyor.`;
        emptyMessage.hidden = visibleCount > 0;
    }

    // Canlı arama olayı
    searchInput.addEventListener("input", applyFilters);

    // Kategori filtre butonları olayı
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeCategory = normalizeText(button.dataset.filter || "all");
            setActiveCategoryButton(activeCategory);
            applyFilters();
        });
    });

    // Temizle butonu olayı
    clearButton.addEventListener("click", () => {
        searchInput.value = "";
        activeCategory = "all";
        setActiveCategoryButton("all");

        // URL'de ?kategori= varsa temizle (lokal file:// açılışlarda hata vermemesi için try/catch)
        try {
            if (window.location.search) {
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        } catch (err) {
            // Lokal dosya sisteminde replaceState engellenirse sessizce devam et
        }

        applyFilters();
        searchInput.focus();
    });

    // 1) URL parametresi varsa uygula ve ilk filtrelemeyi çalıştır
    applyInitialCategoryFromUrl();
    applyFilters();

    // 2) Kartlara tıklanınca açılan tek sayfa görünümlü detay ekranını kur
    initCardDetailModal(cards);
}

/**
 * Kart başlığına göre CARD_EXTRA_DETAILS içinden ilgili ekstra veriyi bulur.
 */
function findExtraDetailsForCard(cardTitle, cardCategory) {
    const normalizedTitle = normalizeText(cardTitle);

    for (const [key, details] of Object.entries(CARD_EXTRA_DETAILS)) {
        if (normalizedTitle.startsWith(key) || normalizedTitle.includes(key)) {
            return details;
        }
    }

    // Beklenmeyen bir başlık durumunda güvenli varsayılan içerik
    if (cardCategory === "tarif") {
        return {
            type: "tarif",
            prepTime: "15 Dakika",
            macros: "Yüksek Proteinli Dengeli Sporcu Öğünü",
            steps: ["Malzemeleri hazırlayıp pratik yapılış adımlarını sırayla uygula."],
            tip: "Şef İpucu: Taze baharat ve dengeli porsiyonla lezzetini artırabilirsin."
        };
    }

    return {
        type: "egzersiz",
        setsReps: "3-4 Set x 10-12 Tekrar • Dinlenme: 60-90 saniye",
        muscles: "Hedef kas grubu ve dengeleyici yardımcı kaslar",
        steps: ["Hareketi kontrollü tempoda, nefesini düzenleyerek ve doğru formda uygula."],
        tip: "Püf Noktası: Ağırlıktan önce daima form kalitesine odaklan."
    };
}

/**
 * icerikler.html'deki kartları tıklanabilir yapar ve dinamik detay ekranını (modal) yönetir.
 */
function initCardDetailModal(cards) {
    let lastFocusedElement = null;

    // Dinamik detay ekranı HTML iskeletini bir kez oluşturup sayfaya ekle
    const modalBackdrop = document.createElement("div");
    modalBackdrop.className = "detail-modal-backdrop";
    modalBackdrop.id = "detail-modal";
    modalBackdrop.setAttribute("role", "dialog");
    modalBackdrop.setAttribute("aria-modal", "true");
    modalBackdrop.setAttribute("aria-labelledby", "detail-modal-title");
    modalBackdrop.hidden = true;

    modalBackdrop.innerHTML = `
    <div class="detail-modal-sheet" id="detail-modal-sheet">
      <div class="detail-modal-topbar">
        <button type="button" class="detail-modal-back" data-close-modal="true">
          &larr; Kütüphaneye Dön
        </button>
        <button type="button" class="detail-modal-close" data-close-modal="true" aria-label="Detay ekranını kapat">
          &times;
        </button>
      </div>

      <div class="detail-modal-hero">
        <img src="" alt="" class="detail-modal-img" id="detail-modal-img">
      </div>

      <div class="detail-modal-content">
        <div class="detail-modal-header">
          <span class="card-badge" id="detail-modal-badge"></span>
          <h2 class="detail-modal-title" id="detail-modal-title"></h2>
          <p class="detail-modal-meta" id="detail-modal-meta" hidden></p>
          <p class="detail-modal-description" id="detail-modal-description"></p>
        </div>

        <div class="detail-modal-origin-box" id="detail-modal-origin-box"></div>

        <section class="detail-modal-extra" aria-label="Detaylı rehber">
          <h3 class="detail-modal-section-heading" id="detail-modal-extra-heading"></h3>
          <div class="detail-extra-grid" id="detail-modal-extra-grid"></div>
        </section>

        <div class="detail-modal-footer">
          <button type="button" class="detail-modal-back" data-close-modal="true">
            &larr; Kütüphaneye Dön
          </button>
        </div>
      </div>
    </div>
  `;

    document.body.appendChild(modalBackdrop);

    const modalSheet = document.getElementById("detail-modal-sheet");
    const modalImg = document.getElementById("detail-modal-img");
    const modalBadge = document.getElementById("detail-modal-badge");
    const modalTitle = document.getElementById("detail-modal-title");
    const modalMeta = document.getElementById("detail-modal-meta");
    const modalDescription = document.getElementById("detail-modal-description");
    const modalOriginBox = document.getElementById("detail-modal-origin-box");
    const modalExtraHeading = document.getElementById("detail-modal-extra-heading");
    const modalExtraGrid = document.getElementById("detail-modal-extra-grid");
    const firstCloseBtn = modalBackdrop.querySelector(".detail-modal-close");

    /**
     * Seçilen kartın tüm bilgilerini doldurup detay ekranını açar.
     */
    function openModalForCard(card) {
        lastFocusedElement = document.activeElement;

        const category = normalizeText(card.dataset.category || "");
        const imgEl = card.querySelector(".card-img");
        const badgeEl = card.querySelector(".card-badge");
        const titleEl = card.querySelector("h2");
        const metaEl = card.querySelector(".card-meta");
        const descEl = card.querySelector(".card-description");
        const detailBoxEl = card.querySelector(".detail-box");

        const titleText = titleEl ? titleEl.textContent.trim() : "";
        const extra = findExtraDetailsForCard(titleText, category);

        // Tarif veya egzersiz tema sınıfını uygula
        modalSheet.classList.toggle("is-recipe", category === "tarif");

        // Kapak fotoğrafı, rozet, başlık ve açıklama
        if (imgEl) {
            modalImg.src = imgEl.src;
            modalImg.alt = imgEl.alt;
        }

        if (badgeEl) {
            modalBadge.textContent = badgeEl.textContent.trim();
            modalBadge.className = badgeEl.className;
        }

        modalTitle.textContent = titleText;

        if (metaEl && metaEl.textContent.trim()) {
            modalMeta.textContent = metaEl.textContent.trim();
            modalMeta.hidden = false;
        } else {
            modalMeta.textContent = "";
            modalMeta.hidden = true;
        }

        modalDescription.textContent = descEl ? descEl.textContent.trim() : "";

        // Kartın mevcut .detail-box içeriğini güvenli biçimde kopyala
        modalOriginBox.innerHTML = "";
        if (detailBoxEl) {
            modalOriginBox.appendChild(detailBoxEl.cloneNode(true));
        }

        // Ekstra detaylı bilgileri oluştur
        const stepsHtml = extra.steps
            .map((step) => `<li>${step}</li>`)
            .join("");

        if (category === "tarif") {
            modalExtraHeading.textContent = "Detaylı Tarif & Makro Rehberi";
            modalExtraGrid.innerHTML = `
        <div class="detail-extra-item">
          <span class="detail-extra-label">Hazırlama Süresi</span>
          <p class="detail-extra-text">${extra.prepTime}</p>
        </div>
        <div class="detail-extra-item">
          <span class="detail-extra-label">Tahmini Makro (P / K / Y / Kalori)</span>
          <p class="detail-extra-text">${extra.macros}</p>
        </div>
        <div class="detail-extra-item is-full">
          <span class="detail-extra-label">Adım Adım Tarif &amp; Şef İpucu</span>
          <ul class="detail-step-list">${stepsHtml}</ul>
          <div class="detail-tip-box"><strong>${extra.tip.split(":")[0]}:</strong>${extra.tip.slice(extra.tip.indexOf(":") + 1)}</div>
        </div>
      `;
        } else {
            modalExtraHeading.textContent = "Detaylı Antrenman & Teknik Rehberi";
            modalExtraGrid.innerHTML = `
        <div class="detail-extra-item">
          <span class="detail-extra-label">Önerilen Set &amp; Tekrar</span>
          <p class="detail-extra-text">${extra.setsReps}</p>
        </div>
        <div class="detail-extra-item">
          <span class="detail-extra-label">Çalışan Ana &amp; Yardımcı Kaslar</span>
          <p class="detail-extra-text">${extra.muscles}</p>
        </div>
        <div class="detail-extra-item is-full">
          <span class="detail-extra-label">Adım Adım Uygulama / Püf Noktası</span>
          <ul class="detail-step-list">${stepsHtml}</ul>
          <div class="detail-tip-box"><strong>${extra.tip.split(":")[0]}:</strong>${extra.tip.slice(extra.tip.indexOf(":") + 1)}</div>
        </div>
      `;
        }

        // Modalı aç, en üste kaydır ve arka plan kaydırmasını kilitle
        modalBackdrop.hidden = false;
        modalBackdrop.scrollTop = 0;
        document.body.classList.add("modal-open");

        if (firstCloseBtn) {
            firstCloseBtn.focus();
        }
    }

    /**
     * Detay ekranını kapatır ve önceki odağı geri yükler.
     */
    function closeModal() {
        if (modalBackdrop.hidden) {
            return;
        }

        modalBackdrop.hidden = true;
        document.body.classList.remove("modal-open");

        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
            lastFocusedElement.focus();
        }
    }

    // Her karta tıklama, klavye erişilebilirliği ve görsel "Detayları İncele" ipucu ekle
    cards.forEach((card) => {
        const titleEl = card.querySelector("h2");
        const cardBody = card.querySelector(".card-body");

        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
        if (titleEl) {
            card.setAttribute("aria-label", `${titleEl.textContent.trim()} detaylarını aç`);
        }

        if (cardBody && !cardBody.querySelector(".card-more-hint")) {
            const hint = document.createElement("div");
            hint.className = "card-more-hint";
            hint.innerHTML = `<span>Detayları İncele</span><span aria-hidden="true">&rarr;</span>`;
            cardBody.appendChild(hint);
        }

        card.addEventListener("click", () => {
            openModalForCard(card);
        });

        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openModalForCard(card);
            }
        });
    });

    // Üst/alt "Kütüphaneye Dön" ve "X" butonlarına tıklayınca kapat
    modalBackdrop.addEventListener("click", (event) => {
        const clickedBackdrop = event.target === modalBackdrop;
        const clickedCloseBtn = Boolean(event.target.closest("[data-close-modal='true']"));

        if (clickedBackdrop || clickedCloseBtn) {
            closeModal();
        }
    });

    // Klavyeden ESC tuşuna basınca detay ekranını kapat
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modalBackdrop.hidden) {
            closeModal();
        }
    });
}