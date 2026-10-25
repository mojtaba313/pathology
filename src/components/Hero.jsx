import { faNum } from '../lib/utils.js'

export default function Hero({ lessonCount, questionCount, flashcardCount }) {
  return (
    <header className="hero">
      <div className="eyebrow">درس‌یار تعاملی • پاتولوژی ژنتیک</div>
      <h1>ماژول ۱: مبانی اختلالات ژنتیکی</h1>
      <p>
        نسخه بازسازی‌شده و مفصل برای امتحان دشوار: معماری ژنوم، SNP/SNV و CNV،
        اپی‌ژنتیک، انواع جهش، پیامدهای پروتئینی، وراثت مندلی و مثال‌های بالینی.
        متن جزوه‌ها مبناست؛ تکمیل‌ها و اصلاحات علمی به‌صورت آموزشی اضافه شده‌اند.
      </p>
      <div className="pills">
        <span className="pill">{faNum(lessonCount)} بخش آموزشی</span>
        <span className="pill">{faNum(questionCount)} سؤال چهارگزینه‌ای</span>
        <span className="pill">{faNum(flashcardCount)} فلش‌کارت</span>
        <span className="pill">تمام صفحات دو جزوه در گالری</span>
        <span className="pill">آفلاین</span>
      </div>
    </header>
  )
}
