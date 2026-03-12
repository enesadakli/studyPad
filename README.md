# StudyPad

Tablet kalemi destekli, AI destekli öğrenci not alma uygulaması. PDF ve slaytları görüntülerken el yazısı veya yazılı notlar al, AI ile özetle, flashcard ve çalışma soruları üret.

## Özellikler

### Aşama 1 — Tamamlandı
- **Canvas Editörü** — Fabric.js tabanlı; kalem (pointer pressure desteği), highlighter, silgi, metin kutusu, dikdörtgen, elips, ok
- **Sayfa Şablonları** — Boş, çizgili, kareli, noktalı, Cornell
- **Undo/Redo** — 50 adım geçmiş (Ctrl+Z / Ctrl+Y)
- **Otomatik Kayıt** — localStorage'a her 30 saniyede bir
- **Ders & Sayfa Yönetimi** — Klasörler, renkler, sürükle-bırak sıralama
- **Etiket Sistemi** — Renk kodlu etiketler
- **Tema** — Karanlık / açık tema toggle
- **Görsel Ekleme** — Sürükle-bırak ile canvas'a görsel ekle
- **PNG Dışa Aktarma** — Canvas'ı PNG olarak indir

### Aşama 2 — Planlandı
- PDF.js entegrasyonu
- Split-screen modu (PDF + Canvas yan yana, sürüklenebilir ayraç)
- PDF üzerine doğrudan çizim
- PDF içi arama, thumbnail şeridi
- .pptx / .docx → PDF dönüştürme

### Aşama 3 — Planlandı
- Claude AI entegrasyonu
- Not özeti (kısa / orta / detaylı)
- Çalışma soruları üretme
- Flashcard üretici + flip animasyonu + sınav modu
- Notlar hakkında sohbet

### Aşama 4 — Planlandı
- Pomodoro zamanlayıcı
- Takvim (sınav / ödev tarihleri)
- İlerleme takibi ve haftalık grafik

### Aşama 5 — Planlandı
- El yazısı → metin (Tesseract.js OCR)
- Ses kaydı + otomatik transkript
- Matematik formülü → LaTeX tanıma

### Aşama 6 — Planlandı
- XP & seviye sistemi
- Streak takibi
- Haftalık lig & leaderboard
- Sosyal özellikler

## Teknoloji

| Katman | Teknoloji |
|---|---|
| Framework | React + Vite |
| Stil | Tailwind CSS |
| Canvas | Fabric.js v6 |
| PDF | PDF.js (Aşama 2) |
| AI | Claude API (Aşama 3) |
| Durum Yönetimi | Zustand |
| Depolama | localStorage / IndexedDB |

## Kurulum

```bash
npm install
npm run dev
```

## Klavye Kısayolları

| Kısayol | Eylem |
|---|---|
| `Ctrl+Z` | Geri al |
| `Ctrl+Y` | İleri al |
| `Ctrl+S` | Anlık kaydet |
| `Ctrl+Scroll` | Zoom in/out |
| `Ctrl+Shift+A` | AI panelini aç/kapat |
| `Delete` | Seçili nesneyi sil |
