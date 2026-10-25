import architectureHtml from '../content/architecture.html?raw'
import variantsHtml from '../content/variants.html?raw'
import epigeneticsHtml from '../content/epigenetics.html?raw'
import terminologyHtml from '../content/terminology.html?raw'
import mutationClassesHtml from '../content/mutation-classes.html?raw'
import geneEffectsHtml from '../content/gene-effects.html?raw'
import mendelianHtml from '../content/mendelian.html?raw'
import synthesisHtml from '../content/synthesis.html?raw'

export const LESSONS = [
  {
    id: 'architecture',
    title: '۱) معماری ژنوم: از ژن تا پروتئین',
    mins: '۱۵ دقیقه',
    source:
      'جزوه انگلیسی: اسلایدهای ۲–۳ و جزوه فارسی: صفحه‌های ۲–۳؛ تکمیل آموزشی بر پایه Robbins',
    html: architectureHtml,
  },
  {
    id: 'variants',
    title: '۲) واریانت‌ها: SNP، SNV و CNV',
    mins: '۱۸ دقیقه',
    source:
      'جزوه انگلیسی: اسلایدهای ۳–۵؛ جزوه فارسی: صفحه ۲؛ تکمیل و رفع ابهام اصطلاحی با Robbins',
    html: variantsHtml,
  },
  {
    id: 'epigenetics',
    title: '۳) اپی‌ژنتیک و miRNA: تنظیم بدون تغییر توالی',
    mins: '۱۵ دقیقه',
    source:
      'جزوه انگلیسی: اسلایدهای ۵–۸؛ جزوه فارسی: صفحه‌های ۲–۳؛ مسیر مولکولی تکمیلی',
    html: epigeneticsHtml,
  },
  {
    id: 'terminology',
    title: '۴) ژنتیکی، ارثی، مادرزادی یا فامیلی؟',
    mins: '۱۲ دقیقه',
    source: 'جزوه انگلیسی: اسلایدهای ۱۰–۱۵؛ جزوه فارسی: صفحه‌های ۲–۳',
    html: terminologyHtml,
  },
  {
    id: 'mutation-classes',
    title: '۵) جهش‌ها: از germline تا تغییرهای کروموزومی',
    mins: '۱۸ دقیقه',
    source: 'جزوه انگلیسی: اسلایدهای ۱۵–۲۴؛ جزوه فارسی: صفحه‌های ۲–۴',
    html: mutationClassesHtml,
  },
  {
    id: 'gene-effects',
    title: '۶) اثر جهش: از missense تا کم‌خونی داسی‌شکل',
    mins: '۲۲ دقیقه',
    source:
      'جزوه انگلیسی: اسلایدهای ۱۷–۲۴؛ جزوه فارسی: صفحه‌های ۳–۴؛ اصلاح اصطلاحات با Robbins',
    html: geneEffectsHtml,
  },
  {
    id: 'mendelian',
    title: '۷) وراثت مندلی: الگوها، خطرها و دام‌ها',
    mins: '۲۵ دقیقه',
    source:
      'جزوه انگلیسی: اسلایدهای ۲۴–۳۵؛ تکمیل با فصل Genetic Diseases در Robbins',
    html: mendelianHtml,
  },
  {
    id: 'synthesis',
    title: '۸) جمع‌بندی امتحانی: نکته‌ها و دام‌ها',
    mins: '۱۰ دقیقه',
    source: 'ترکیب جزوه‌ها با چارچوب رابینز؛ این بخش خلاصه‌ی خودآزمایی است',
    html: synthesisHtml,
  },
]
