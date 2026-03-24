import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { GlassCard, VideoCard, MiniMissionCard, HelpSafetyCard, XPBadge } from '@/components/gamified/GamifiedUI';
import { EmojiIcon } from '@/components/EmojiIcon';

const AWARENESS_CONTENT = [
  {
    id: 'child-labour',
    emoji: '🧱',
    title_en: 'Child Labour',
    title_hi: 'बाल श्रम',
    xp: 70,
    youtubeId: 'dQw4w9WgXcQ',
    what_en:
      'Child labour means making children work in shops, homes, factories or on the street instead of going to school and playing.',
    what_hi:
      'बाल श्रम का मतलब है बच्चों से दुकानों, घरों, फैक्ट्रियों या सड़कों पर काम करवाना, जबकि उन्हें स्कूल जाना और खेलना चाहिए।',
    why_en:
      'Working too early can harm a child’s body, stop their education and put them in unsafe situations.',
    why_hi:
      'बहुत जल्दी काम करने से बच्चों के शरीर पर बुरा असर पड़ सकता है, उनकी पढ़ाई रुक सकती है और वे असुरक्षित स्थिति में जा सकते हैं।',
    law_en:
      'In India, laws like the Child Labour (Prohibition and Regulation) Act and the RTE Act do not allow children below 14 to work in most jobs.',
    law_hi:
      'भारत में बाल श्रम (निषेध और विनियमन) अधिनियम और RTE अधिनियम जैसे कानून 14 वर्ष से कम आयु के बच्चों को अधिकतर कार्यों में काम करने की अनुमति नहीं देते।',
    you_en:
      'If you see a child working, you can tell a trusted adult, teacher or call Childline 1098 for help.',
    you_hi:
      'यदि आप किसी बच्चे को काम करते देखें, तो किसी भरोसेमंद बड़े, शिक्षक या चाइल्डलाइन 1098 पर कॉल करके मदद मांग सकते हैं।',
    missionTitle_en: 'Notice work around you',
    missionTitle_hi: 'अपने आसपास काम करते बच्चों को पहचानें',
    missionDesc_en:
      'Look around your area or way to school. Do you see any children working? Think of one safe adult you could tell.',
    missionDesc_hi:
      'अपने आसपास या स्कूल जाने के रास्ते पर देखें। क्या आप किसी बच्चे को काम करते देखते हैं? एक सुरक्षित बड़े के बारे में सोचें जिससे आप यह बात कह सकते हैं।',
  },
  {
    id: 'child-abuse',
    emoji: '🚫',
    title_en: 'Child Abuse',
    title_hi: 'बाल शोषण',
    xp: 80,
    youtubeId: 'dQw4w9WgXcQ',
    what_en:
      'Child abuse means when someone hurts a child’s body, feelings or dignity through hitting, shouting, bullying or unsafe touch.',
    what_hi:
      'बाल शोषण का मतलब है जब कोई बच्चे के शरीर, भावनाओं या सम्मान को चोट पहुँचाता है—मारकर, डांटकर, डराकर या असुरक्षित स्पर्श से।',
    why_en:
      'Abuse can make children scared, sad and unsafe, and it can affect their health and studies for a long time.',
    why_hi:
      'शोषण से बच्चे डरे, उदास और असुरक्षित महसूस कर सकते हैं और इसका असर उनकी सेहत और पढ़ाई पर लंबे समय तक पड़ सकता है।',
    law_en:
      'The POCSO Act and other child protection laws in India strictly punish physical, emotional and sexual abuse of children.',
    law_hi:
      'भारत में POCSO अधिनियम और अन्य बाल संरक्षण कानून बच्चों के शारीरिक, मानसिक और यौन शोषण के लिए सख़्त सज़ा का प्रावधान करते हैं।',
    you_en:
      'If anyone makes you uncomfortable or unsafe, you can say NO, move away, and tell a trusted adult or call Childline 1098.',
    you_hi:
      'अगर कोई आपको असहज या असुरक्षित महसूस कराए, तो आप “नहीं” कह सकते हैं, वहाँ से हट सकते हैं और किसी भरोसेमंद बड़े या चाइल्डलाइन 1098 को बता सकते हैं।',
    missionTitle_en: 'Learn about safe and unsafe touch',
    missionTitle_hi: 'सुरक्षित और असुरक्षित स्पर्श समझें',
    missionDesc_en:
      'Talk to a trusted adult or teacher about “safe” and “unsafe” touch and learn three adults you can go to if you ever feel unsafe.',
    missionDesc_hi:
      'किसी भरोसेमंद बड़े या शिक्षक से “सुरक्षित” और “असुरक्षित” स्पर्श के बारे में बात करें और ऐसे तीन बड़ों के बारे में सोचें जिनके पास आप असुरक्षित महसूस होने पर जा सकते हैं।',
  },
  {
    id: 'online-safety',
    emoji: '💻',
    title_en: 'Online Safety',
    title_hi: 'ऑनलाइन सुरक्षा',
    xp: 60,
    youtubeId: 'dQw4w9WgXcQ',
    what_en:
      'Online safety means protecting yourself from strangers, bullying, cheating and harmful content on the internet, games and social media.',
    what_hi:
      'ऑनलाइन सुरक्षा का मतलब है इंटरनेट, गेम्स और सोशल मीडिया पर अनजान लोगों, बदमाशी, धोखे और हानिकारक सामग्री से खुद को बचाना।',
    why_en:
      'Sharing personal details or talking to strangers online can put children at risk of bullying, fraud or even real-world danger.',
    why_hi:
      'ऑनलाइन अपनी निजी जानकारी साझा करना या अनजान लोगों से बात करना बच्चों को बदमाशी, धोखाधड़ी या असली दुनिया के ख़तरे में डाल सकता है।',
    law_en:
      'IT laws and cybercrime cells in India help punish online bullying, threats and misuse of private photos or information.',
    law_hi:
      'भारत में आईटी कानून और साइबर क्राइम सेल ऑनलाइन बदमाशी, धमकी और निजी फोटो या जानकारी के गलत इस्तेमाल पर कार्रवाई करते हैं।',
    you_en:
      'Never share your password, address, school name or personal photos with strangers online. Always tell a trusted adult if something online feels wrong.',
    you_hi:
      'अपना पासवर्ड, पता, स्कूल का नाम या निजी फोटो कभी भी ऑनलाइन अजनबियों से साझा न करें। अगर ऑनलाइन कुछ भी गलत लगे तो तुरंत किसी भरोसेमंद बड़े को बताएं।',
    missionTitle_en: 'Make your online use safer',
    missionTitle_hi: 'अपनी ऑनलाइन आदतों को सुरक्षित बनाएं',
    missionDesc_en:
      'Check one app or game you use and see if your profile is private. Ask a trusted adult to help you turn on safety or privacy settings.',
    missionDesc_hi:
      'कोई एक ऐप या गेम चुनें जो आप इस्तेमाल करते हैं और देखें कि आपका प्रोफाइल प्राइवेट है या नहीं। किसी भरोसेमंद बड़े से मदद लेकर उसकी सुरक्षा या प्राइवेसी सेटिंग्स ठीक करें।',
  },
  {
    id: 'school-safety',
    emoji: '🏫',
    title_en: 'School Safety',
    title_hi: 'स्कूल सुरक्षा',
    xp: 70,
    youtubeId: 'dQw4w9WgXcQ',
    what_en:
      'School safety means that classrooms, playgrounds, toilets and school buses should be safe, clean and free from bullying or violence.',
    what_hi:
      'स्कूल सुरक्षा का मतलब है कि कक्षा, खेल मैदान, शौचालय और स्कूल बसें सुरक्षित, साफ-सुथरी और हिंसा या बदमाशी से मुक्त हों।',
    why_en:
      'If children feel safe in school, they can learn better, ask questions freely and enjoy being with friends.',
    why_hi:
      'जब बच्चे स्कूल में सुरक्षित महसूस करते हैं, वे बेहतर पढ़ पाते हैं, निडर होकर सवाल पूछते हैं और दोस्तों के साथ समय का मज़ा लेते हैं।',
    law_en:
      'Guidelines under RTE, child protection and safety rules require schools to prevent bullying, abuse and accidents.',
    law_hi:
      'RTE, बाल संरक्षण और सुरक्षा नियमों के तहत स्कूलों पर बदमाशी, शोषण और दुर्घटनाओं को रोकने की जिम्मेदारी होती है।',
    you_en:
      'If you see bullying, unsafe buildings, broken toilets or any teacher or student behaving violently, you can inform a trusted teacher or head of the school.',
    you_hi:
      'अगर आप बदमाशी, टूटी इमारतें, खराब शौचालय या किसी शिक्षक/बच्चे को हिंसक व्यवहार करते देखें, तो किसी भरोसेमंद शिक्षक या स्कूल के प्रधानाचार्य को बता सकते हैं।',
    missionTitle_en: 'Look at safety in your school',
    missionTitle_hi: 'अपने स्कूल की सुरक्षा पर नज़र डालें',
    missionDesc_en:
      'Notice one place in your school that feels unsafe or uncomfortable and think of one simple change that could make it safer.',
    missionDesc_hi:
      'अपने स्कूल में ऐसी एक जगह पहचानें जहाँ आप असुरक्षित या असहज महसूस करते हैं और सोचें कि उसे सुरक्षित बनाने के लिए क्या छोटी सी बदल की जा सकती है।',
  },
  {
    id: 'juvenile-justice',
    emoji: '⚖️',
    title_en: 'Juvenile Justice',
    title_hi: 'किशोर न्याय',
    xp: 90,
    youtubeId: 'dQw4w9WgXcQ',
    what_en:
      'Juvenile justice is the system that deals with children who are in conflict with the law or need care and protection.',
    what_hi:
      'किशोर न्याय वह व्यवस्था है जो उन बच्चों के मामलों को देखती है जो कानून के साथ संघर्ष में हैं या जिन्हें देखभाल और संरक्षण की आवश्यकता है।',
    why_en:
      'Instead of only punishing children, the law tries to understand their situation, protect their rights and help them change.',
    why_hi:
      'बच्चों को केवल सज़ा देने की बजाय कानून उनकी स्थिति को समझने, उनके अधिकारों की रक्षा करने और उन्हें बदलने में मदद करने की कोशिश करता है।',
    law_en:
      'The Juvenile Justice (Care and Protection of Children) Act lays down how children in conflict with the law must be treated with dignity and given rehabilitation.',
    law_hi:
      'किशोर न्याय (बालकों की देखरेख और संरक्षण) अधिनियम यह सुनिश्चित करता है कि कानून के साथ संघर्ष में आए बच्चों के साथ गरिमा से व्यवहार हो और उन्हें पुनर्वास के अवसर मिलें।',
    you_en:
      'If you see a child in trouble with the police or living on the street, you can inform Childline 1098 or a child welfare committee through a trusted adult.',
    you_hi:
      'यदि आप किसी बच्चे को पुलिस के साथ परेशानी में या सड़क पर रहते देखें, तो किसी भरोसेमंद बड़े की मदद से चाइल्डलाइन 1098 या चाइल्ड वेलफेयर कमेटी को सूचना दे सकते हैं।',
    missionTitle_en: 'Think about second chances',
    missionTitle_hi: 'दूसरा मौका देने के बारे में सोचें',
    missionDesc_en:
      'Imagine a child who made a mistake. Think of one way society could help them learn and improve instead of only blaming them.',
    missionDesc_hi:
      'किसी ऐसे बच्चे की कल्पना करें जिसने गलती की हो। सोचें कि समाज उसे सिर्फ दोष देने की बजाय उसे सीखने और बेहतर बनने का कौन सा मौका दे सकता है।',
  },
] as const;

export default function LegalAwarenessDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const topic = AWARENESS_CONTENT.find((t) => t.id === id) ?? AWARENESS_CONTENT[0];
  const title = lang === 'hi' ? topic.title_hi : topic.title_en;

  return (
    <div className="space-y-8 relative overflow-hidden">
      {/* Floating Emoji Background */}
      {[...Array(6)].map((_, i) => {
        const emojis = ['⭐', '✨', '📢', '🧠', '🛡️', '🏆'];
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
                <EmojiIcon emoji={topic.emoji} size={48} />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <XPBadge xp={topic.xp} />
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold">{title}</h1>
              <p className="text-sm text-muted-foreground">
                {lang === 'hi'
                  ? 'इस महत्वपूर्ण विषय को सरल तरीके से समझें और खुद को सुरक्षित रखें।'
                  : 'Understand this important topic in a simple way and keep yourself safe.'}
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
            youtubeId={topic.youtubeId}
            xpReward={topic.xp}
          />

          <GlassCard className="p-4 lg:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <EmojiIcon emoji="❓" size={22} />
              <h2 className="font-semibold text-sm">
                {lang === 'hi' ? 'समस्या क्या है?' : 'What is the problem?'}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {lang === 'hi' ? topic.what_hi : topic.what_en}
            </p>
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
              {lang === 'hi' ? topic.law_hi : topic.law_en}
            </p>
          </GlassCard>
        </div>

        <div className="space-y-4">
          <GlassCard className="p-4 lg:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <EmojiIcon emoji="🧠" size={22} />
              <h2 className="font-semibold text-sm">
                {lang === 'hi' ? 'आपको यह क्यों जानना चाहिए?' : 'Why should you know this?'}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {lang === 'hi' ? topic.why_hi : topic.why_en}
            </p>
          </GlassCard>

          <GlassCard className="p-4 lg:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <EmojiIcon emoji="🗣️" size={22} />
              <h2 className="font-semibold text-sm">
                {lang === 'hi' ? 'आप क्या कर सकते हैं?' : 'What should YOU do?'}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {lang === 'hi' ? topic.you_hi : topic.you_en}
            </p>
          </GlassCard>

          <MiniMissionCard
            title={lang === 'hi' ? topic.missionTitle_hi : topic.missionTitle_en}
            description={lang === 'hi' ? topic.missionDesc_hi : topic.missionDesc_en}
            xpReward={topic.xp}
          />

          <HelpSafetyCard />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/awareness')}>
            ← {lang === 'hi' ? 'सभी विषय' : 'Back to all topics'}
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


