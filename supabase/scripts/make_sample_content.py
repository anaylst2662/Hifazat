"""Generates supabase/seed_awareness_samples.sql (SAMPLE content, never to be published).

Run: python3 supabase/scripts/make_sample_content.py
Every item is marked SAMPLE — DO NOT PUBLISH and is_sample = true.
All text must be replaced by content written and reviewed by qualified local experts.
"""
import json
from pathlib import Path

S = "SAMPLE — DO NOT PUBLISH"
SU = "نمونہ — شائع نہ کریں"

items = [
    dict(code="smp001", type="article", topic="consent", core=True, order=10,
         audiences=["women", "men", "parents", "teachers", "friends", "community"],
         en=dict(title="What is consent?",
                 summary="Consent means a clear, free “yes”. It can be changed at any time.",
                 body="Consent means agreeing to something freely, without pressure, fear or threats.\n\n"
                      "- Consent must be given freely. Silence or fear is not a “yes”.\n"
                      "- Consent can be taken back at any time.\n"
                      "- Agreeing to one thing does not mean agreeing to everything.\n"
                      "- A person who is asleep, drunk or very young cannot give consent.\n\n"
                      "If someone did something to you without your consent, it is not your fault. "
                      "The responsibility belongs to the person who did it."),
         ur=dict(title="رضامندی کیا ہے؟",
                 summary="رضامندی کا مطلب ہے واضح اور آزادانہ \"ہاں\"۔ اسے کسی بھی وقت بدلا جا سکتا ہے۔",
                 body="رضامندی کا مطلب ہے کسی بات پر بغیر دباؤ، خوف یا دھمکی کے آزادانہ طور پر راضی ہونا۔\n\n"
                      "- رضامندی آزادانہ ہونی چاہیے۔ خاموشی یا خوف \"ہاں\" نہیں ہے۔\n"
                      "- رضامندی کسی بھی وقت واپس لی جا سکتی ہے۔\n"
                      "- ایک بات پر راضی ہونے کا مطلب ہر بات پر راضی ہونا نہیں۔\n"
                      "- سویا ہوا، نشے میں یا بہت کم عمر شخص رضامندی نہیں دے سکتا۔\n\n"
                      "اگر کسی نے آپ کی رضامندی کے بغیر آپ کے ساتھ کچھ کیا تو اس میں آپ کا کوئی قصور نہیں۔ "
                      "ذمہ داری اس شخص کی ہے جس نے ایسا کیا۔")),
    dict(code="smp002", type="article", topic="harassment", core=True, order=10,
         audiences=["women", "men", "community", "teachers"],
         en=dict(title="What is harassment?",
                 summary="Unwanted words or actions that make you feel unsafe, scared or humiliated.",
                 body="Harassment is unwanted behaviour that makes a person feel unsafe, scared or humiliated. "
                      "It can happen on the street, at school, at work, at home or online.\n\n"
                      "- Comments about someone’s body or looks\n"
                      "- Following someone, or staring to scare them\n"
                      "- Touching without permission\n"
                      "- Messages, calls or photos that are not wanted\n\n"
                      "Harassment is never the fault of the person it happens to. "
                      "It does not depend on what they wear or where they go."),
         ur=dict(title="ہراسانی کیا ہے؟",
                 summary="ناپسندیدہ باتیں یا حرکتیں جو آپ کو غیر محفوظ، خوف زدہ یا شرمندہ محسوس کرائیں۔",
                 body="ہراسانی ایسا ناپسندیدہ رویہ ہے جو کسی کو غیر محفوظ، خوف زدہ یا شرمندہ محسوس کرائے۔ "
                      "یہ گلی میں، اسکول میں، کام پر، گھر میں یا آن لائن ہو سکتی ہے۔\n\n"
                      "- کسی کے جسم یا شکل کے بارے میں تبصرے\n"
                      "- کسی کا پیچھا کرنا، یا ڈرانے کے لیے گھورنا\n"
                      "- اجازت کے بغیر چھونا\n"
                      "- ناپسندیدہ پیغامات، کالیں یا تصاویر\n\n"
                      "ہراسانی کبھی بھی اس شخص کا قصور نہیں جس کے ساتھ یہ ہو۔ "
                      "اس کا تعلق اس بات سے نہیں کہ وہ کیا پہنتے ہیں یا کہاں جاتے ہیں۔")),
    dict(code="smp003", type="scenario", topic="harassment", core=True, order=20,
         audiences=["women", "friends", "teachers", "parents"],
         en=dict(title="Is this harassment? On the way to school",
                 summary="A short situation, and what you can do.",
                 scenario_situation="Every day, a group of boys waits near the bridge and makes comments about a girl "
                                    "as she walks to school. Yesterday they followed her part of the way.",
                 scenario_answer="Yes. Repeated unwanted comments and following someone are harassment. "
                                 "It is not her fault, and it is not about what she wears or how she walks.",
                 scenario_actions="- If you can, walk with a friend or family member.\n"
                                  "- Tell an adult you trust, or a teacher.\n"
                                  "- Write down the dates, times and places. This can help later.\n"
                                  "- You can find verified support in “I Need Help”."),
         ur=dict(title="کیا یہ ہراسانی ہے؟ اسکول جاتے ہوئے",
                 summary="ایک مختصر صورتحال، اور آپ کیا کر سکتے ہیں۔",
                 scenario_situation="روزانہ لڑکوں کا ایک گروہ پل کے قریب انتظار کرتا ہے اور اسکول جاتی ایک لڑکی پر "
                                    "تبصرے کرتا ہے۔ کل انہوں نے کچھ دور تک اس کا پیچھا بھی کیا۔",
                 scenario_answer="جی ہاں۔ بار بار ناپسندیدہ تبصرے اور پیچھا کرنا ہراسانی ہے۔ "
                                 "اس میں لڑکی کا کوئی قصور نہیں، اور اس کا تعلق اس کے لباس یا چال سے نہیں۔",
                 scenario_actions="- اگر ممکن ہو تو کسی دوست یا گھر کے فرد کے ساتھ جائیں۔\n"
                                  "- کسی قابلِ بھروسہ بڑے یا استاد کو بتائیں۔\n"
                                  "- تاریخیں، وقت اور جگہیں لکھ لیں۔ یہ بعد میں مدد دے سکتا ہے۔\n"
                                  "- \"مجھے مدد چاہیے\" میں آپ تصدیق شدہ مدد تلاش کر سکتے ہیں۔")),
    dict(code="smp004", type="scenario", topic="online", core=True, order=10,
         audiences=["women", "men", "friends", "parents"],
         en=dict(title="Is this harassment? Pressure to send photos",
                 summary="When someone online asks for private photos and makes threats.",
                 scenario_situation="Someone you met online keeps asking for private photos. When you say no, "
                                    "they say they will share an old picture of you with your family.",
                 scenario_answer="Yes. This is blackmail and online abuse. It is a crime in many places, "
                                 "and it is not your fault, even if you shared something before.",
                 scenario_actions="- Do not send more photos or money.\n"
                                  "- Keep screenshots of the messages and the account name.\n"
                                  "- Block and report the account on the app.\n"
                                  "- Tell someone you trust. You can find verified support in “I Need Help”."),
         ur=dict(title="کیا یہ ہراسانی ہے؟ تصاویر بھیجنے کا دباؤ",
                 summary="جب کوئی آن لائن نجی تصاویر مانگے اور دھمکیاں دے۔",
                 scenario_situation="کوئی شخص جس سے آپ آن لائن ملے، بار بار نجی تصاویر مانگتا ہے۔ جب آپ انکار کرتے ہیں "
                                    "تو وہ کہتا ہے کہ وہ آپ کی ایک پرانی تصویر آپ کے گھر والوں کو بھیج دے گا۔",
                 scenario_answer="جی ہاں۔ یہ بلیک میلنگ اور آن لائن زیادتی ہے۔ بہت سی جگہوں پر یہ جرم ہے، "
                                 "اور اس میں آپ کا کوئی قصور نہیں، چاہے آپ نے پہلے کچھ شیئر کیا ہو۔",
                 scenario_actions="- مزید تصاویر یا رقم نہ بھیجیں۔\n"
                                  "- پیغامات اور اکاؤنٹ کے نام کے اسکرین شاٹ محفوظ رکھیں۔\n"
                                  "- ایپ پر اکاؤنٹ کو بلاک اور رپورٹ کریں۔\n"
                                  "- کسی قابلِ بھروسہ شخص کو بتائیں۔ \"مجھے مدد چاہیے\" میں تصدیق شدہ مدد موجود ہے۔")),
    dict(code="smp005", type="faq", topic="domestic", core=True, order=10,
         audiences=["women", "men", "community", "friends"],
         en=dict(title="Is it abuse if there is no hitting?",
                 summary="Abuse is not only physical.",
                 body="Yes, it can be. Abuse is not only hitting. It can also be:\n\n"
                      "- Controlling who you see, where you go or what you wear\n"
                      "- Taking your money or documents\n"
                      "- Threats, constant insults or making you afraid\n"
                      "- Forcing any sexual act, including within marriage\n\n"
                      "You deserve to feel safe at home. Support is available, and you can decide what to do next."),
         ur=dict(title="اگر مار پیٹ نہ ہو تو کیا پھر بھی یہ زیادتی ہے؟",
                 summary="زیادتی صرف جسمانی نہیں ہوتی۔",
                 body="جی ہاں، ہو سکتی ہے۔ زیادتی صرف مار پیٹ نہیں۔ یہ یہ بھی ہو سکتی ہے:\n\n"
                      "- یہ کنٹرول کرنا کہ آپ کس سے ملیں، کہاں جائیں یا کیا پہنیں\n"
                      "- آپ کی رقم یا دستاویزات لے لینا\n"
                      "- دھمکیاں، مسلسل توہین یا آپ کو خوف زدہ رکھنا\n"
                      "- کسی بھی جنسی عمل پر مجبور کرنا، شادی کے اندر بھی\n\n"
                      "گھر میں محفوظ محسوس کرنا آپ کا حق ہے۔ مدد موجود ہے، اور آگے کیا کرنا ہے یہ آپ طے کر سکتے ہیں۔")),
    dict(code="smp006", type="faq", topic="stalking", core=False, order=10,
         audiences=["women", "men", "friends"],
         en=dict(title="What counts as stalking?",
                 summary="Repeated behaviour that makes you feel watched or afraid.",
                 body="Stalking is when someone keeps contacting, following or watching a person in a way that makes them afraid.\n\n"
                      "- Following you or waiting outside your home, school or work\n"
                      "- Repeated calls or messages after you asked them to stop\n"
                      "- Tracking your phone or checking your accounts\n\n"
                      "Keeping a simple record of what happens (dates, times, screenshots) can help if you decide to get support."),
         ur=dict(title="پیچھا کرنا کسے کہتے ہیں؟",
                 summary="بار بار کا ایسا رویہ جس سے لگے کہ آپ پر نظر رکھی جا رہی ہے یا آپ خوف زدہ ہوں۔",
                 body="پیچھا کرنا یہ ہے کہ کوئی شخص بار بار کسی سے رابطہ کرے، اس کا پیچھا کرے یا اس پر نظر رکھے، جس سے وہ خوف زدہ ہو۔\n\n"
                      "- آپ کا پیچھا کرنا یا آپ کے گھر، اسکول یا دفتر کے باہر انتظار کرنا\n"
                      "- منع کرنے کے بعد بھی بار بار کالیں یا پیغامات\n"
                      "- آپ کے فون کو ٹریک کرنا یا آپ کے اکاؤنٹس دیکھنا\n\n"
                      "جو کچھ ہو اس کا سادہ ریکارڈ (تاریخیں، وقت، اسکرین شاٹ) رکھنا مدد لینے کا فیصلہ کرنے پر کام آ سکتا ہے۔")),
    dict(code="smp007", type="quiz", topic="consent", core=False, order=20,
         audiences=["women", "men", "teachers", "friends"],
         en=dict(title="Quick quiz: consent and boundaries",
                 summary="Three short questions. Your answers stay on your phone.",
                 quiz=[
                     dict(prompt="Someone says “yes” because they are afraid. Is that consent?",
                          options=["Yes", "No"], correct=1,
                          explanation="Consent must be free. A “yes” given out of fear is not consent."),
                     dict(prompt="Can a person change their mind after saying yes?",
                          options=["Yes, at any time", "No, a yes is final"], correct=0,
                          explanation="Consent can be taken back at any time."),
                     dict(prompt="A friend tells you something bad happened to them. What helps most?",
                          options=["Asking what they did wrong", "Listening and believing them", "Telling others straight away"],
                          correct=1,
                          explanation="Listening without blame helps. Let them decide what happens next."),
                 ]),
         ur=dict(title="مختصر کوئز: رضامندی اور حدود",
                 summary="تین مختصر سوال۔ آپ کے جواب آپ کے فون پر ہی رہتے ہیں۔",
                 quiz=[
                     dict(prompt="کوئی شخص ڈر کی وجہ سے \"ہاں\" کہتا ہے۔ کیا یہ رضامندی ہے؟",
                          options=["ہاں", "نہیں"], correct=1,
                          explanation="رضامندی آزادانہ ہونی چاہیے۔ ڈر سے کہی گئی \"ہاں\" رضامندی نہیں۔"),
                     dict(prompt="کیا کوئی شخص \"ہاں\" کہنے کے بعد اپنا ارادہ بدل سکتا ہے؟",
                          options=["ہاں، کسی بھی وقت", "نہیں، ہاں آخری ہے"], correct=0,
                          explanation="رضامندی کسی بھی وقت واپس لی جا سکتی ہے۔"),
                     dict(prompt="ایک دوست آپ کو بتاتا ہے کہ اس کے ساتھ کچھ برا ہوا۔ سب سے زیادہ کیا مدد دیتا ہے؟",
                          options=["یہ پوچھنا کہ اس نے کیا غلطی کی", "سننا اور یقین کرنا", "فوراً دوسروں کو بتا دینا"],
                          correct=1,
                          explanation="بغیر الزام کے سننا مدد دیتا ہے۔ آگے کیا ہو، یہ انہیں طے کرنے دیں۔"),
                 ])),
    dict(code="smp008", type="article", topic="child-safety", core=True, order=10,
         audiences=["parents", "teachers", "community"],
         en=dict(title="Talking with children about body safety",
                 summary="Simple words that help children speak up.",
                 body="Children are safer when they know they can talk to you about anything.\n\n"
                      "- Teach the correct names for body parts.\n"
                      "- Explain that no one should touch their private parts, and that they can say no, even to adults they know.\n"
                      "- Say there are no secrets that make them feel scared or uncomfortable.\n"
                      "- Tell them they will never be in trouble for telling you.\n\n"
                      "If a child tells you something, stay calm, believe them and thank them for telling you."),
         ur=dict(title="بچوں سے جسمانی تحفظ کے بارے میں بات کرنا",
                 summary="سادہ الفاظ جو بچوں کو بولنے میں مدد دیتے ہیں۔",
                 body="بچے زیادہ محفوظ ہوتے ہیں جب انہیں معلوم ہو کہ وہ آپ سے ہر بات کر سکتے ہیں۔\n\n"
                      "- انہیں جسم کے حصوں کے درست نام سکھائیں۔\n"
                      "- بتائیں کہ کسی کو ان کے نجی حصوں کو چھونے کا حق نہیں، اور وہ جاننے والے بڑوں کو بھی \"نہیں\" کہہ سکتے ہیں۔\n"
                      "- بتائیں کہ ایسا کوئی راز نہیں ہونا چاہیے جو انہیں ڈرائے یا پریشان کرے۔\n"
                      "- انہیں یقین دلائیں کہ آپ کو بتانے پر وہ کبھی مشکل میں نہیں پڑیں گے۔\n\n"
                      "اگر کوئی بچہ آپ کو کچھ بتائے تو پرسکون رہیں، اس پر یقین کریں اور بتانے کا شکریہ ادا کریں۔")),
    dict(code="smp009", type="campaign", topic="harassment", core=False, order=90,
         audiences=["women", "men", "parents", "teachers", "friends", "community"],
         en=dict(title="Don't Let Fear Silence You",
                 summary="Learn. Prevent. Protect. Report. Support.",
                 body="Nobody should have to stay silent because of fear. Share this message to let people know that support exists.",
                 image_url="/samples/campaign-smp009-en.jpg",
                 image_alt="Poster with the words: Don't Let Fear Silence You. Learn. Prevent. Protect. Report. Support.",
                 share_text="Don't Let Fear Silence You. Learn. Prevent. Protect. Report. Support."),
         ur=dict(title="خوف کو اپنی آواز دبانے نہ دیں",
                 summary="سیکھیں۔ روک تھام کریں۔ تحفظ کریں۔ رپورٹ کریں۔ سہارا دیں۔",
                 body="کسی کو بھی خوف کی وجہ سے خاموش نہیں رہنا چاہیے۔ یہ پیغام شیئر کریں تاکہ لوگ جانیں کہ مدد موجود ہے۔",
                 image_url="/samples/campaign-smp009-ur.jpg",
                 image_alt="پوسٹر جس پر لکھا ہے: خوف کو اپنی آواز دبانے نہ دیں۔",
                 share_text="خوف کو اپنی آواز دبانے نہ دیں۔ سیکھیں۔ روک تھام کریں۔ تحفظ کریں۔ رپورٹ کریں۔ سہارا دیں۔")),
    dict(code="smp010", type="campaign", topic="consent", core=False, order=91,
         audiences=["women", "men", "friends", "community"],
         en=dict(title="No Means No",
                 summary="Respect boundaries. Every time.",
                 body="A “no” is a complete answer. It does not need a reason, and it deserves respect.",
                 image_url="/samples/campaign-smp010-en.jpg",
                 image_alt="Poster with the words: No Means No. Respect boundaries. Every time.",
                 share_text="No Means No. Respect boundaries. Every time."),
         ur=dict(title="نہیں کا مطلب نہیں",
                 summary="حدود کا احترام کریں۔ ہر بار۔",
                 body="\"نہیں\" ایک مکمل جواب ہے۔ اسے کسی وجہ کی ضرورت نہیں، اور یہ احترام کا حق دار ہے۔",
                 image_url="/samples/campaign-smp010-ur.jpg",
                 image_alt="پوسٹر جس پر لکھا ہے: نہیں کا مطلب نہیں۔",
                 share_text="نہیں کا مطلب نہیں۔ حدود کا احترام کریں۔ ہر بار۔")),
]


def q(value):
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (list, dict)):
        return "'" + json.dumps(value, ensure_ascii=False).replace("'", "''") + "'::jsonb"
    return "'" + str(value).replace("'", "''") + "'"


FIELDS = ["title", "summary", "body", "scenario_situation", "scenario_answer", "scenario_actions",
          "quiz", "image_url", "image_alt", "share_text"]

out = [
    "-- =============================================================================",
    f"-- {S}",
    "-- Development content for the Awareness Hub. Generated by",
    "-- supabase/scripts/make_sample_content.py (edit that file, not this one).",
    "--",
    "-- * Every item has is_sample = true and status 'in_review', so it can NEVER be",
    "--   published. It is only shown while app_settings.show_sample_content = true.",
    "-- * All text must be replaced by content written by qualified local experts",
    "--   and reviewed before launch. Urdu text is a DRAFT.",
    "-- =============================================================================",
    "",
]
for it in items:
    out.append(f"-- {it['code']}: {it['en']['title']}")
    out.append("insert into public.content_items (code, type, topic_id, status, is_sample, is_core, sort_order) values "
               f"({q(it['code'])}, {q(it['type'])}, {q(it['topic'])}, 'in_review', true, {q(it['core'])}, {it['order']});")
    out.append("insert into public.content_audiences (content_id, audience_id) select id, a from public.content_items, "
               f"unnest(array[{', '.join(q(a) for a in it['audiences'])}]) a where code = {q(it['code'])};")
    for lang, label in (("en", "SAMPLE"), ("ur", "نمونہ")):
        t = dict(it[lang])
        t["title"] = f"{label}: {t['title']}"
        cols = ", ".join(["content_id", "lang"] + [f for f in FIELDS if f in t])
        vals = ", ".join([f"(select id from public.content_items where code = {q(it['code'])})", q(lang)]
                         + [q(t[f]) for f in FIELDS if f in t])
        out.append(f"insert into public.content_translations ({cols}) values ({vals});")
    out.append("")

Path(__file__).resolve().parents[1].joinpath("seed_awareness_samples.sql").write_text("\n".join(out), encoding="utf-8")
print(f"Wrote {len(items)} sample items.")
