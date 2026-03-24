import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { GlassCard, DifficultyDots, VideoCard, MiniMissionCard, HelpSafetyCard, XPBadge } from '@/components/gamified/GamifiedUI';
import { EmojiIcon } from '@/components/EmojiIcon';

const RIGHTS_CONTENT = [
  {
    id: 'education',
    emoji: '📚',
    title_en: 'Right to Education',
    title_hi: 'शिक्षा का अधिकार',
    xp: 80,
    difficulty: 2,
    youtubeId: 'dQw4w9WgXcQ',
    simple_en: [
      'Every child between 6 and 14 years must be able to go to school for free.',
      'Schools cannot refuse to admit a child just because of money, caste, religion or gender.',
    ],
    simple_hi: [
      '6 से 14 वर्ष के हर बच्चे को मुफ्त स्कूल जाने का अधिकार है।',
      'स्कूल किसी भी बच्चे को पैसे, जाति, धर्म या लिंग के कारण मना नहीं कर सकते।',
    ],
    law_en:
      'In India, the Right to Education is protected by the RTE Act, 2009 and Article 21A of the Constitution. It makes free and compulsory education a fundamental right.',
    law_hi:
      'भारत में शिक्षा का अधिकार RTE अधिनियम, 2009 और संविधान के अनुच्छेद 21A द्वारा सुरक्षित है। यह मुफ्त और अनिवार्य शिक्षा को मौलिक अधिकार बनाता है।',
    problem_en: 'Many children are still forced to work or stay at home instead of going to school.',
    problem_hi: 'आज भी कई बच्चों को स्कूल जाने के बजाय काम करने या घर पर रहने के लिए मजबूर किया जाता है।',
    why_en: 'Education helps children understand their rights, get good jobs later and make safer choices.',
    why_hi: 'शिक्षा बच्चों को अपने अधिकार समझने, आगे चलकर बेहतर काम पाने और सुरक्षित निर्णय लेने में मदद करती है।',
    missionTitle_en: 'Spot a Right to Education violation',
    missionTitle_hi: 'शिक्षा अधिकार का उल्लंघन पहचानें',
    missionDesc_en: 'Think of any child you know who is not going to school. What could be done to help them?',
    missionDesc_hi: 'ऐसे किसी बच्चे के बारे में सोचें जो स्कूल नहीं जा रहा। उसकी मदद के लिए क्या किया जा सकता है?',
  },
  {
    id: 'protection',
    emoji: '🛡️',
    title_en: 'Right to Protection',
    title_hi: 'सुरक्षा का अधिकार',
    xp: 90,
    difficulty: 3,
    youtubeId: 'dQw4w9WgXcQ',
    simple_en: [
      'Children must be kept safe from physical, emotional and sexual abuse.',
      'No one is allowed to hurt, threaten or exploit a child at home, school or work.',
    ],
    simple_hi: [
      'बच्चों को शारीरिक, मानसिक और यौन शोषण से सुरक्षित रखा जाना चाहिए।',
      'घर, स्कूल या काम पर कोई भी बच्चें को चोट नहीं पहुँचा सकता, डरा-धमका नहीं सकता या उसका शोषण नहीं कर सकता।',
    ],
    law_en:
      'In India, laws like the POCSO Act, Juvenile Justice Act and IPC protect children from abuse, exploitation and cruelty.',
    law_hi:
      'भारत में POCSO अधिनियम, किशोर न्याय अधिनियम और IPC जैसे कानून बच्चों को शोषण, अत्याचार और क्रूरता से बचाते हैं।',
    problem_en:
      'Many cases of violence and abuse against children are hidden because children are afraid to speak.',
    problem_hi:
      'बच्चों के साथ हिंसा और शोषण के कई मामले छुपे रह जाते हैं क्योंकि बच्चे डर के कारण बात नहीं कर पाते।',
    why_en:
      'Knowing this right helps children understand that abuse is never their fault and that they deserve protection.',
    why_hi:
      'यह अधिकार जानने से बच्चों को समझ आता है कि शोषण कभी उनकी गलती नहीं होती और वे हमेशा सुरक्षा के हकदार हैं।',
    missionTitle_en: 'Notice if a child feels unsafe',
    missionTitle_hi: 'जब कोई बच्चा असुरक्षित लगे तो पहचानें',
    missionDesc_en:
      'Think of situations where a child might feel scared or unsafe. Who is one trusted adult you could talk to if this happened?',
    missionDesc_hi:
      'ऐसी स्थितियों के बारे में सोचें जहाँ कोई बच्चा डरा हुआ या असुरक्षित महसूस कर सकता है। ऐसा एक भरोसेमंद बड़ा सोचें जिससे आप बात कर सकते हैं।',
  },
  {
    id: 'health',
    emoji: '🏥',
    title_en: 'Right to Health',
    title_hi: 'स्वास्थ्य का अधिकार',
    xp: 70,
    difficulty: 2,
    youtubeId: 'dQw4w9WgXcQ',
    simple_en: [
      'Children have the right to go to a doctor and get medicine when they are sick.',
      'Clean water, nutritious food and vaccines are part of good health.',
    ],
    simple_hi: [
      'बच्चों को बीमार होने पर डॉक्टर के पास जाने और दवा लेने का अधिकार है।',
      'साफ पानी, पौष्टिक भोजन और टीकाकरण अच्छे स्वास्थ्य का हिस्सा हैं।',
    ],
    law_en:
      'Under the Constitution and laws like the National Health Mission and ICDS, the state must provide basic healthcare and nutrition to children.',
    law_hi:
      'संविधान और राष्ट्रीय स्वास्थ्य मिशन, ICDS जैसे कार्यक्रमों के तहत राज्य पर बच्चों को बुनियादी स्वास्थ्य सेवा और पोषण देने की जिम्मेदारी है।',
    problem_en:
      'Some children still do not get proper food, vaccines or timely treatment, especially in poorer areas.',
    problem_hi:
      'कई बच्चों को अब भी सही भोजन, टीके या समय पर इलाज नहीं मिल पाता, खासकर गरीब इलाकों में।',
    why_en:
      'Good health helps children grow, learn well in school and enjoy play without falling sick again and again.',
    why_hi:
      'अच्छा स्वास्थ्य बच्चों को बढ़ने, स्कूल में अच्छी तरह सीखने और बार-बार बीमार हुए बिना खेलने में मदद करता है।',
    missionTitle_en: 'Check your health habits',
    missionTitle_hi: 'अपनी सेहत की आदतें देखें',
    missionDesc_en:
      'Think of one small change you can make today—like drinking more clean water or washing hands before eating.',
    missionDesc_hi:
      'आज आप एक छोटी सेहत वाली आदत बदलने के बारे में सोचें—जैसे साफ पानी ज्यादा पीना या खाना खाने से पहले हाथ धोना।',
  },
  {
    id: 'equality',
    emoji: '⚖️',
    title_en: 'Right to Equality',
    title_hi: 'समानता का अधिकार',
    xp: 75,
    difficulty: 2,
    youtubeId: 'dQw4w9WgXcQ',
    simple_en: [
      'All children are equal—no matter their gender, caste, religion, language or how much money they have.',
      'Teachers, families and others should treat every child with the same respect.',
    ],
    simple_hi: [
      'सभी बच्चे बराबर हैं—चाहे उनका लिंग, जाति, धर्म, भाषा या आर्थिक स्थिति कुछ भी हो।',
      'शिक्षक, परिवार और बाकी लोग हर बच्चे के साथ समान सम्मान से पेश आएं।',
    ],
    law_en:
      'Articles 14, 15 and 21 of the Indian Constitution protect equality and forbid discrimination against any child.',
    law_hi:
      'भारतीय संविधान के अनुच्छेद 14, 15 और 21 समानता की गारंटी देते हैं और किसी भी बच्चे के साथ भेदभाव को रोकते हैं।',
    problem_en:
      'Some children are still teased, left out or given fewer chances because of their gender, caste or background.',
    problem_hi:
      'आज भी कई बच्चों को उनके लिंग, जाति या पृष्ठभूमि के कारण चिढ़ाया जाता है, अलग किया जाता है या कम मौके दिए जाते हैं।',
    why_en:
      'Understanding equality helps children stand up for themselves and others when they see unfair behaviour.',
    why_hi:
      'समानता को समझने से बच्चे अपने और दूसरों के लिए खड़े हो पाते हैं जब वे किसी तरह का अन्याय देखते हैं।',
    missionTitle_en: 'Include someone who is left out',
    missionTitle_hi: 'किसी ऐसे बच्चे को साथ लें जो अकेला है',
    missionDesc_en:
      'Notice if any child in your class or area is often alone or teased. Think of one way you can include or support them.',
    missionDesc_hi:
      'ध्यान दें कि आपकी कक्षा या मोहल्ले में कोई बच्चा अक्सर अकेला तो नहीं रहता या चिढ़ाया तो नहीं जाता। सोचें, आप उसे अपने साथ कैसे जोड़ सकते हैं।',
  },
  {
    id: 'identity',
    emoji: '🆔',
    title_en: 'Right to Identity',
    title_hi: 'पहचान का अधिकार',
    xp: 65,
    difficulty: 1,
    youtubeId: 'dQw4w9WgXcQ',
    simple_en: [
      'Every child has the right to a name, nationality and family ties from birth.',
      'Official documents like birth certificates and Aadhaar help prove a child’s identity.',
    ],
    simple_hi: [
      'हर बच्चे को जन्म से नाम, राष्ट्रीयता और परिवार से जुड़ी पहचान का अधिकार है।',
      'जन्म प्रमाण पत्र और आधार जैसे कागज़ बच्चे की पहचान साबित करने में मदद करते हैं।',
    ],
    law_en:
      'The UN Convention on the Rights of the Child and Indian laws recognise a child’s right to a name and nationality.',
    law_hi:
      'बच्चों के अधिकारों पर संयुक्त राष्ट्र संधि और भारतीय कानून हर बच्चे के नाम और राष्ट्रीयता के अधिकार को मान्यता देते हैं।',
    problem_en:
      'Some children do not have proper documents, which can make it hard to join school or get services later.',
    problem_hi:
      'कई बच्चों के पास सही कागज़ नहीं होते, जिससे उन्हें स्कूल में दाखिला लेने या भविष्य में सुविधाएं पाने में दिक्कत हो सकती है।',
    why_en:
      'Identity documents help children access education, health services and government schemes in the future.',
    why_hi:
      'पहचान से जुड़ी दस्तावेज़ बच्चों को आगे चलकर शिक्षा, स्वास्थ्य सेवाओं और सरकारी योजनाओं तक पहुँचने में मदद करते हैं।',
    missionTitle_en: 'Ask about your documents',
    missionTitle_hi: 'अपने कागज़ों के बारे में जानें',
    missionDesc_en:
      'Talk to a trusted adult at home about your birth certificate or other identity documents and where they are kept.',
    missionDesc_hi:
      'घर पर किसी भरोसेमंद बड़े से अपने जन्म प्रमाण पत्र या पहचान के कागज़ों के बारे में बात करें और जानें कि वे कहाँ रखे हैं।',
  },
  {
    id: 'play',
    emoji: '🎮',
    title_en: 'Right to Play',
    title_hi: 'खेलने का अधिकार',
    xp: 60,
    difficulty: 1,
    youtubeId: 'dQw4w9WgXcQ',
    simple_en: [
      'Children have the right to rest, play and enjoy free time—not just study or work.',
      'Games, sports, art and hobbies help children learn, stay healthy and feel happy.',
    ],
    simple_hi: [
      'बच्चों को आराम करने, खेलने और खाली समय का मज़ा लेने का अधिकार है—सिर्फ पढ़ाई या काम करने का नहीं।',
      'खेल, खेलकूद, कला और शौक से बच्चे सीखते हैं, तंदुरुस्त रहते हैं और खुश महसूस करते हैं।',
    ],
    law_en:
      'The UN Convention on the Rights of the Child recognises the right to leisure, play and participation in cultural life.',
    law_hi:
      'बच्चों के अधिकारों पर संयुक्त राष्ट्र संधि बच्चों के आराम, खेल और सांस्कृतिक गतिविधियों में भाग लेने के अधिकार को मान्यता देती है।',
    problem_en:
      'Some children get no safe space or time to play because of long work, chores or lack of parks.',
    problem_hi:
      'कई बच्चों को लंबे काम, घर के काम या पार्क न होने की वजह से खेलने के लिए सुरक्षित जगह या समय नहीं मिल पाता।',
    why_en:
      'Play helps children handle stress, build friendships and develop creativity and teamwork.',
    why_hi:
      'खेलने से बच्चों को तनाव कम करने, दोस्त बनाने और रचनात्मकता व टीमवर्क सीखने में मदद मिलती है।',
    missionTitle_en: 'Plan a healthy play break',
    missionTitle_hi: 'एक अच्छा खेलने का ब्रेक प्लान करें',
    missionDesc_en:
      'Think of one game or fun activity you can do today that does not harm anyone and gives you energy.',
    missionDesc_hi:
      'आज आप एक ऐसा खेल या मज़ेदार गतिविधि चुनें जो किसी को नुकसान न पहुँचाए और आपको ऊर्जा दे।',
  },
] as const;

export default function RightDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const right = RIGHTS_CONTENT.find((r) => r.id === id) ?? RIGHTS_CONTENT[0];

  const title = lang === 'hi' ? right.title_hi : right.title_en;

  return (
    <div className="space-y-8 relative overflow-hidden">
      {/* Floating Emoji Background */}
      {[...Array(6)].map((_, i) => {
        const emojis = ['⭐', '✨', '📚', '🧠', '🦸', '🏆'];
        return (
          <motion.div
            key={i}
            className="absolute pointer-events-none opacity-10"
            style={{
              left: `${12 + i * 14}%`,
              top: `${18 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -28, 0],
              x: [0, Math.sin(i * 0.7) * 20, 0],
              rotate: [0, 18, -18, 0],
              scale: [1, 1.18, 1],
            }}
            transition={{
              duration: 5 + i * 0.4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          >
            <EmojiIcon emoji={emojis[i]} size={26} animated />
          </motion.div>
        );
      })}

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-center gap-6"
      >
        <GlassCard className="flex-1 p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="shrink-0">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
                <EmojiIcon emoji={right.emoji} size={48} />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <XPBadge xp={right.xp} />
                <DifficultyDots level={right.difficulty} />
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold">{title}</h1>
              <p className="text-sm text-muted-foreground">
                {lang === 'hi'
                  ? 'इस अधिकार के बारे में सरल भाषा में जानें और इसे अपने जीवन में पहचानना सीखें।'
                  : 'Learn this right in simple language and spot it in real life situations.'}
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] gap-6 lg:gap-8">
        <div className="space-y-4">
          <VideoCard
            title={title}
            youtubeId={right.youtubeId}
            xpReward={right.xp}
          />

          <GlassCard className="p-4 lg:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <EmojiIcon emoji="📚" size={22} />
              <h2 className="font-semibold text-sm">
                {lang === 'hi' ? 'सरल समझ' : 'Simple Explanation'}
              </h2>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {(lang === 'hi' ? right.simple_hi : right.simple_en).map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <span className="mt-0.5">
                    <EmojiIcon emoji="✨" size={16} />
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard className="p-4 lg:p-5 space-y-3 border-primary/40">
            <div className="flex items-center gap-2">
              <EmojiIcon emoji="🇮🇳" size={22} />
              <h2 className="font-semibold text-sm">
                {lang === 'hi' ? 'भारतीय कानून क्या कहता है?' : 'What does Indian law say?'}
              </h2>
              <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                Indian Law
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {lang === 'hi' ? right.law_hi : right.law_en}
            </p>
          </GlassCard>
        </div>

        <div className="space-y-4">
          <GlassCard className="p-4 lg:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <EmojiIcon emoji="❓" size={22} />
              <h2 className="font-semibold text-sm">
                {lang === 'hi' ? 'समस्या क्या है?' : 'What is the problem?'}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {lang === 'hi' ? right.problem_hi : right.problem_en}
            </p>
          </GlassCard>

          <GlassCard className="p-4 lg:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <EmojiIcon emoji="🧠" size={22} />
              <h2 className="font-semibold text-sm">
                {lang === 'hi' ? 'बच्चों को यह क्यों जानना चाहिए?' : 'Why should kids know this?'}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {lang === 'hi' ? right.why_hi : right.why_en}
            </p>
          </GlassCard>

          <MiniMissionCard
            title={lang === 'hi' ? right.missionTitle_hi : right.missionTitle_en}
            description={lang === 'hi' ? right.missionDesc_hi : right.missionDesc_en}
            xpReward={right.xp}
          />

          <HelpSafetyCard />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/learn')}>
            ← {lang === 'hi' ? 'सभी अधिकार' : 'Back to all rights'}
          </Button>
        </div>
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => navigate('/games')}
          >
            🎮 {lang === 'hi' ? 'संबंधित गेम खेलें' : 'Play related game'}
          </Button>
          <Button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-primary via-secondary to-accent text-white font-semibold border-0"
          >
            🏠 {lang === 'hi' ? 'डैशबोर्ड पर जाएं' : 'Back to dashboard'}
          </Button>
        </div>
      </div>
    </div>
  );
}


