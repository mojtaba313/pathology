export default function ReferencesView() {
  return (
    <section className="panel">
      <div className="sectionhead">
        <div className="eyebrow">منابع و راهنمای استفاده</div>
        <h2>چطور از این ماژول برای امتحان سخت استفاده کنی؟</h2>
        <p>
          ترتیب محتوا بر اساس مبانی بیماری‌های ژنتیکی در رابینز و ترتیب جزوه‌های
          در دسترس ساخته شده است.
        </p>
      </div>

      <h3>منابع مبنا</h3>
      <ul>
        <li>
          <b>جزوه ارائه انگلیسی:</b>{' '}
          <a href="/sources/GENETIC_AND_PEDIATRIC_DISORDERS2.pdf" target="_blank" rel="noreferrer">
            باز کردن PDF اصلی (۱۳۰ صفحه)
          </a>
        </li>
        <li>
          <b>جزوه فارسی:</b>{' '}
          <a href="/sources/جزوه_فارسی_اختلالات_ژنتیک.pdf" target="_blank" rel="noreferrer">
            باز کردن PDF اصلی (۲۳ صفحه)
          </a>
        </li>
        <li>
          <b>Robbins &amp; Cotran Pathologic Basis of Disease, 11th edition:</b>{' '}
          فصل «Genes and Human Diseases» در فهرست جدید کتاب.{' '}
          <a
            href="https://shop.elsevier.com/books/robbins-cotran-and-kumar-pathologic-basis-of-disease/kumar/9780443264528"
            target="_blank"
            rel="noreferrer"
          >
            صفحه رسمی Elsevier
          </a>
          .
        </li>
        <li>
          <b>Robbins Basic Pathology:</b> فصل «Genetic and Pediatric Diseases» در
          نسخه‌های مربوطه؛{' '}
          <a
            href="https://elsevier-elibrary.com/contents/fullcontent/58994/epubcontent_v2/OEBPS/B9781437717815000064.htm"
            target="_blank"
            rel="noreferrer"
          >
            فهرست و صفحه فصل در Elsevier eLibrary
          </a>
          .
        </li>
      </ul>

      <h3>روش یادگیری پیشنهادی</h3>
      <ol>
        <li>هر بخش را یک بار برای فهم بخوان، نه حفظ‌کردن خط‌به‌خط.</li>
        <li>بدون نگاه به متن، جدول‌ها و زنجیره پاتوژنزها را از حافظه بازسازی کن.</li>
        <li>
          تست‌ها را بدون پاسخ‌دیدن حل کن. پاسخ تشریحی را بخوان، به‌خصوص علت غلط
          بودن گزینه‌ها.
        </li>
        <li>
          فلش‌کارت‌ها را یک روز بعد و قبل از خواب مرور کن؛ هر پاسخ نادرست را به
          مبحث مربوط برگردان.
        </li>
        <li>
          تصویرهای اصلی جزوه را در گالری بزرگ کن؛ نسخه تصویر صفحه برای اطمینان از
          حفظ عبارت، شکل و برچسب‌های مدرس در دسترس است.
        </li>
      </ol>

      <div className="note">
        <b>مرزبندی منبع:</b> نکته‌هایی که در متن به‌عنوان «تکمیل آموزشی» یا «دقت
        امتحانی» آمده‌اند از دانش پزشکی/چارچوب رابینز بازنویسی شده‌اند؛ عبارت‌ها و
        عددهایی که صرفاً به جزوه نسبت داده شده‌اند، به عنوان ادعای همان جزوه
        علامت‌گذاری شده‌اند. این فایل بازنویسی آموزشی است و متن کامل یا شکل‌های
        اختصاصی کتاب رابینز را بازنشر نمی‌کند.
      </div>

      <h3>نقشه کل دوره که از این ماژول ادامه می‌یابد</h3>
      <table>
        <thead>
          <tr>
            <th>ماژول</th>
            <th>دامنه پیشنهادی بر اساس جزوه‌ها و ساختار رابینز</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>۱ — همین فایل</td>
            <td>معماری ژنوم، انواع واریانت/جهش، تنظیم بیان ژن، مفاهیم و وراثت مندلی.</td>
          </tr>
          <tr>
            <td>۲</td>
            <td>
              بیماری‌های تک‌ژنی: پروتئین‌های ساختاری، گیرنده/کانال، آنزیم و
              پروتئین‌های کنترل رشد سلول؛ شامل مارفان، Ehlers-Danlos،
              هایپرکلسترولمی خانوادگی، PKU، گالاکتوزمی و ذخیره‌ای‌ها.
            </td>
          </tr>
          <tr>
            <td>۳</td>
            <td>
              اختلالات چندعاملی و سیتوژنتیک: تغییرات عددی/ساختاری، سندرم داون، حذف
              22q11، کروموزوم‌های جنسی و Lyon hypothesis.
            </td>
          </tr>
          <tr>
            <td>۴</td>
            <td>
              توارث غیرمندلی: repeat expansion/Fragile X، میتوکندری، imprinting،
              Prader-Willi و Angelman؛ تشخیص مولکولی.
            </td>
          </tr>
          <tr>
            <td>۵</td>
            <td>
              بیماری‌های کودکان: ناهنجاری مادرزادی، اختلال رشد جنین/نارس بودن، RDS
              نوزاد و hydrops fetalis.
            </td>
          </tr>
          <tr>
            <td>۶</td>
            <td>
              خطاهای مادرزادی متابولیسم و تومورهای شیرخوارگی/کودکی، بر اساس بخش‌های
              باقی‌مانده جزوه‌ها.
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}
