export type PainLevel = 'none' | 'mild' | 'severe';
export type MobilityLevel = 'full' | 'limited' | 'ankylosis';
export type ZoneColor = 'default' | 'green' | 'yellow' | 'red';
export type ExerciseMode = 'normal' | 'mixedA' | 'mixedB' | 'totalMicro' | 'totalVibro';

export interface ZoneState {
  pain: PainLevel;
  mobility: MobilityLevel;
  configured: boolean;
}

export interface Zone {
  id: string;
  name: string;
  shortName: string;
  side?: 'left' | 'right' | 'center';
  group: 'upper' | 'lower' | 'spine';
}

export const ZONES: Zone[] = [
  { id: 'shoulder_left', name: 'Левое плечо', shortName: 'Плечо Л', side: 'left', group: 'upper' },
  { id: 'shoulder_right', name: 'Правое плечо', shortName: 'Плечо П', side: 'right', group: 'upper' },
  { id: 'elbow_left', name: 'Левый локоть', shortName: 'Локоть Л', side: 'left', group: 'upper' },
  { id: 'elbow_right', name: 'Правый локоть', shortName: 'Локоть П', side: 'right', group: 'upper' },
  { id: 'wrist_left', name: 'Левая кисть', shortName: 'Кисть Л', side: 'left', group: 'upper' },
  { id: 'wrist_right', name: 'Правая кисть', shortName: 'Кисть П', side: 'right', group: 'upper' },
  { id: 'fingers_hand_left', name: 'Пальцы левой руки', shortName: 'Пальцы Л', side: 'left', group: 'upper' },
  { id: 'fingers_hand_right', name: 'Пальцы правой руки', shortName: 'Пальцы П', side: 'right', group: 'upper' },
  { id: 'hip_left', name: 'Левый тазобедренный', shortName: 'Таз Л', side: 'left', group: 'lower' },
  { id: 'hip_right', name: 'Правый тазобедренный', shortName: 'Таз П', side: 'right', group: 'lower' },
  { id: 'knee_left', name: 'Левое колено', shortName: 'Колено Л', side: 'left', group: 'lower' },
  { id: 'knee_right', name: 'Правое колено', shortName: 'Колено П', side: 'right', group: 'lower' },
  { id: 'ankle_left', name: 'Левый голеностоп', shortName: 'Голено Л', side: 'left', group: 'lower' },
  { id: 'ankle_right', name: 'Правый голеностоп', shortName: 'Голено П', side: 'right', group: 'lower' },
  { id: 'fingers_foot_left', name: 'Пальцы левой ноги', shortName: 'Пальцы ЛН', side: 'left', group: 'lower' },
  { id: 'fingers_foot_right', name: 'Пальцы правой ноги', shortName: 'Пальцы ПН', side: 'right', group: 'lower' },
  { id: 'neck', name: 'Шея', shortName: 'Шея', side: 'center', group: 'spine' },
  { id: 'upper_back', name: 'Верх спины', shortName: 'Верх спины', side: 'center', group: 'spine' },
  { id: 'lower_back', name: 'Поясница', shortName: 'Поясница', side: 'center', group: 'spine' },
];

export function getZoneColor(state: ZoneState): ZoneColor {
  if (!state.configured) return 'default';
  if (state.pain === 'severe' || state.mobility === 'ankylosis') return 'red';
  if (state.pain === 'mild' || state.mobility === 'limited') return 'yellow';
  return 'green';
}

export function determineMode(zoneStates: Record<string, ZoneState>): ExerciseMode {
  const colors = ZONES.map(z => getZoneColor(zoneStates[z.id] || { pain: 'none', mobility: 'full', configured: false }));
  const reds = colors.filter(c => c === 'red').length;
  const yellows = colors.filter(c => c === 'yellow').length;

  if (reds === 0 && yellows === 0) return 'normal';
  if (reds >= 1 && (reds + yellows) >= 9) return 'totalVibro';
  if (reds >= 1 && reds <= 5) return 'mixedA';
  if (yellows >= 1 && yellows <= 7 && reds === 0) return 'mixedB';
  if (yellows > 7 && reds === 0) return 'totalMicro';
  return 'mixedA';
}

export const MODE_INFO: Record<ExerciseMode, { name: string; bpm: number; icon: string; color: string; description: string }> = {
  normal: { name: 'Обычный режим', bpm: 90, icon: '🚴', color: '#22c55e', description: 'Все суставы в хорошем состоянии' },
  mixedA: { name: 'Смешанный А', bpm: 80, icon: '🚶', color: '#84cc16', description: 'Больные суставы исключены, остальные умеренно' },
  mixedB: { name: 'Смешанный Б', bpm: 50, icon: '🐢', color: '#f59e0b', description: 'Осторожные суставы — микродвижения, здоровые — умеренно' },
  totalMicro: { name: 'Тотальный микро', bpm: 45, icon: '🐢', color: '#f97316', description: 'Только микродвижения для всех суставов' },
  totalVibro: { name: 'Тотальный вибро', bpm: 30, icon: '🕊️', color: '#ef4444', description: 'Только изометрическое напряжение без движений' },
};

export interface Exercise {
  zoneId: string;
  zoneName: string;
  mode: 'normal' | 'micro' | 'vibro';
  name: string;
  description: string;
  reps: string;
}

export const EXERCISES: Exercise[] = [
  // ── NORMAL (90 BPM) ──
  { zoneId: 'shoulder_left', zoneName: 'Плечо левое', mode: 'normal', name: 'Маятник', description: 'Наклонитесь вперёд, левая рука свободно раскачивается вперёд-назад и по кругу', reps: '10–12 качаний' },
  { zoneId: 'shoulder_right', zoneName: 'Плечо правое', mode: 'normal', name: 'Маятник', description: 'Наклонитесь вперёд, правая рука свободно раскачивается вперёд-назад и по кругу', reps: '10–12 качаний' },
  { zoneId: 'elbow_left', zoneName: 'Локоть левый', mode: 'normal', name: 'Сгибание-разгибание', description: 'Медленно сгибайте левую руку в локте до упора и полностью разгибайте', reps: '10–12 повторений' },
  { zoneId: 'elbow_right', zoneName: 'Локоть правый', mode: 'normal', name: 'Сгибание-разгибание', description: 'Медленно сгибайте правую руку в локте до упора и полностью разгибайте', reps: '10–12 повторений' },
  { zoneId: 'wrist_left', zoneName: 'Кисть левая', mode: 'normal', name: 'Сжатие кулака', description: 'Медленно сожмите левую кисть в кулак, задержите секунду и полностью раскройте', reps: '10–12 повторений' },
  { zoneId: 'wrist_left', zoneName: 'Кисть левая', mode: 'normal', name: 'Круговые движения запястьем', description: 'Вращайте левой кистью по часовой стрелке, затем против. Локоть неподвижен', reps: '8 кругов в каждую сторону' },
  { zoneId: 'wrist_right', zoneName: 'Кисть правая', mode: 'normal', name: 'Сжатие кулака', description: 'Медленно сожмите правую кисть в кулак, задержите секунду и полностью раскройте', reps: '10–12 повторений' },
  { zoneId: 'wrist_right', zoneName: 'Кисть правая', mode: 'normal', name: 'Круговые движения запястьем', description: 'Вращайте правой кистью по часовой стрелке, затем против. Локоть неподвижен', reps: '8 кругов в каждую сторону' },
  { zoneId: 'fingers_hand_left', zoneName: 'Пальцы левой руки', mode: 'normal', name: 'Веер', description: 'Медленно раскрывайте левую ладонь максимально широко и закрывайте', reps: '10–12 повторений' },
  { zoneId: 'fingers_hand_left', zoneName: 'Пальцы левой руки', mode: 'normal', name: 'Кольца', description: 'По очереди соединяйте каждый палец с большим, образуя кольцо: мизинец → безымянный → средний → указательный', reps: '2–3 цикла' },
  { zoneId: 'fingers_hand_left', zoneName: 'Пальцы левой руки', mode: 'normal', name: 'Сжатие мяча', description: 'Представьте мягкий мячик в левой руке. Сожмите пальцы как будто выжимаете его, затем полностью отпустите', reps: '10–12 повторений' },
  { zoneId: 'fingers_hand_right', zoneName: 'Пальцы правой руки', mode: 'normal', name: 'Веер', description: 'Медленно раскрывайте правую ладонь максимально широко и закрывайте', reps: '10–12 повторений' },
  { zoneId: 'fingers_hand_right', zoneName: 'Пальцы правой руки', mode: 'normal', name: 'Кольца', description: 'По очереди соединяйте каждый палец с большим, образуя кольцо: мизинец → безымянный → средний → указательный', reps: '2–3 цикла' },
  { zoneId: 'fingers_hand_right', zoneName: 'Пальцы правой руки', mode: 'normal', name: 'Сжатие мяча', description: 'Представьте мягкий мячик в правой руке. Сожмите пальцы как будто выжимаете его, затем полностью отпустите', reps: '10–12 повторений' },
  { zoneId: 'hip_left', zoneName: 'Тазобедренный левый', mode: 'normal', name: 'Подъём ноги лёжа', description: 'Лёжа на спине, медленно поднимайте прямую левую ногу до 45° и плавно опускайте', reps: '8–10 повторений' },
  { zoneId: 'hip_right', zoneName: 'Тазобедренный правый', mode: 'normal', name: 'Подъём ноги лёжа', description: 'Лёжа на спине, медленно поднимайте прямую правую ногу до 45° и плавно опускайте', reps: '8–10 повторений' },
  { zoneId: 'knee_left', zoneName: 'Колено левое', mode: 'normal', name: 'Сгибание сидя', description: 'Сидя на стуле, медленно поднимайте и опускайте левую голень, сгибая ногу в колене', reps: '10–12 повторений' },
  { zoneId: 'knee_right', zoneName: 'Колено правое', mode: 'normal', name: 'Сгибание сидя', description: 'Сидя на стуле, медленно поднимайте и опускайте правую голень, сгибая ногу в колене', reps: '10–12 повторений' },
  { zoneId: 'ankle_left', zoneName: 'Голеностоп левый', mode: 'normal', name: 'Насос', description: 'Тяните носок левой ноги на себя (пятка вперёд) и от себя поочерёдно — как насос', reps: '12–15 повторений' },
  { zoneId: 'ankle_left', zoneName: 'Голеностоп левый', mode: 'normal', name: 'Круговые движения', description: 'Вращайте левой стопой по кругу: 8 раз по часовой, 8 раз против. Голень неподвижна', reps: '8 кругов в каждую сторону' },
  { zoneId: 'ankle_right', zoneName: 'Голеностоп правый', mode: 'normal', name: 'Насос', description: 'Тяните носок правой ноги на себя (пятка вперёд) и от себя поочерёдно — как насос', reps: '12–15 повторений' },
  { zoneId: 'ankle_right', zoneName: 'Голеностоп правый', mode: 'normal', name: 'Круговые движения', description: 'Вращайте правой стопой по кругу: 8 раз по часовой, 8 раз против. Голень неподвижна', reps: '8 кругов в каждую сторону' },
  { zoneId: 'fingers_foot_left', zoneName: 'Пальцы левой ноги', mode: 'normal', name: 'Сжатие-разжатие', description: 'Медленно сожмите пальцы левой ноги (будто хватаете полотенце с пола) и полностью раскройте', reps: '10–12 повторений' },
  { zoneId: 'fingers_foot_left', zoneName: 'Пальцы левой ноги', mode: 'normal', name: 'Перекаты', description: 'Поочерёдно поднимайте пальцы левой ноги вверх и опускайте — от мизинца к большому и обратно', reps: '2–3 цикла' },
  { zoneId: 'fingers_foot_right', zoneName: 'Пальцы правой ноги', mode: 'normal', name: 'Сжатие-разжатие', description: 'Медленно сожмите пальцы правой ноги (будто хватаете полотенце с пола) и полностью раскройте', reps: '10–12 повторений' },
  { zoneId: 'fingers_foot_right', zoneName: 'Пальцы правой ноги', mode: 'normal', name: 'Перекаты', description: 'Поочерёдно поднимайте пальцы правой ноги вверх и опускайте — от мизинца к большому и обратно', reps: '2–3 цикла' },
  { zoneId: 'neck', zoneName: 'Шея', mode: 'normal', name: 'Наклоны головы', description: 'Медленно наклоняйте голову: вправо, вернитесь, влево, вернитесь. Затем вперёд и назад — без рывков', reps: '5 наклонов в каждую сторону' },
  { zoneId: 'upper_back', zoneName: 'Верх спины', mode: 'normal', name: 'Лодочка', description: 'Лёжа на животе, медленно поднимайте прямые руки и плечи на 5–10 см, задержите 2 сек, опустите', reps: '8–10 повторений' },
  { zoneId: 'lower_back', zoneName: 'Поясница', mode: 'normal', name: 'Кошка-верблюд', description: 'На четвереньках: плавно округляйте поясницу вверх (кошка) и прогибайте вниз (верблюд). 1 удар — одна фаза', reps: '8–10 повторений' },

  // ── MICRO (40–50 BPM) ──
  { zoneId: 'shoulder_left', zoneName: 'Плечо левое', mode: 'micro', name: 'Пожимание плечом', description: 'Поднимайте левое плечо на 1–2 см, задержите и медленно опустите', reps: '8–10 повторений' },
  { zoneId: 'shoulder_right', zoneName: 'Плечо правое', mode: 'micro', name: 'Пожимание плечом', description: 'Поднимайте правое плечо на 1–2 см, задержите и медленно опустите', reps: '8–10 повторений' },
  { zoneId: 'elbow_left', zoneName: 'Локоть левый', mode: 'micro', name: 'Микросгибание', description: 'Очень лёгкое сгибание левой руки на 5–10°, почти незаметно. Без напряжения', reps: '8–10 повторений' },
  { zoneId: 'elbow_right', zoneName: 'Локоть правый', mode: 'micro', name: 'Микросгибание', description: 'Очень лёгкое сгибание правой руки на 5–10°, почти незаметно. Без напряжения', reps: '8–10 повторений' },
  { zoneId: 'wrist_left', zoneName: 'Кисть левая', mode: 'micro', name: 'Микросжатие', description: 'Едва заметно сожмите левую кисть — пальцы слегка согнулись, не в кулак. Расслабьте', reps: '8–10 повторений' },
  { zoneId: 'wrist_right', zoneName: 'Кисть правая', mode: 'micro', name: 'Микросжатие', description: 'Едва заметно сожмите правую кисть — пальцы слегка согнулись, не в кулак. Расслабьте', reps: '8–10 повторений' },
  { zoneId: 'fingers_hand_left', zoneName: 'Пальцы левой руки', mode: 'micro', name: 'Микровеер', description: 'Слегка раздвиньте пальцы левой руки на 1–2 мм, затем сведите. Движение едва заметное', reps: '8–10 повторений' },
  { zoneId: 'fingers_hand_right', zoneName: 'Пальцы правой руки', mode: 'micro', name: 'Микровеер', description: 'Слегка раздвиньте пальцы правой руки на 1–2 мм, затем сведите. Движение едва заметное', reps: '8–10 повторений' },
  { zoneId: 'hip_left', zoneName: 'Тазобедренный левый', mode: 'micro', name: 'Скольжение пяткой', description: 'Лёжа на спине, медленно скользите левой пяткой по поверхности — сгибая колено на 10–15 см и обратно', reps: '6–8 повторений' },
  { zoneId: 'hip_right', zoneName: 'Тазобедренный правый', mode: 'micro', name: 'Скольжение пяткой', description: 'Лёжа на спине, медленно скользите правой пяткой по поверхности — сгибая колено на 10–15 см и обратно', reps: '6–8 повторений' },
  { zoneId: 'knee_left', zoneName: 'Колено левое', mode: 'micro', name: 'Микровыпрямление', description: 'Сидя на стуле, очень лёгкое выпрямление левой ноги на 5–10°. Плавно, не до конца', reps: '8–10 повторений' },
  { zoneId: 'knee_right', zoneName: 'Колено правое', mode: 'micro', name: 'Микровыпрямление', description: 'Сидя на стуле, очень лёгкое выпрямление правой ноги на 5–10°. Плавно, не до конца', reps: '8–10 повторений' },
  { zoneId: 'ankle_left', zoneName: 'Голеностоп левый', mode: 'micro', name: 'Микро-насос', description: 'Очень маленькое движение левой стопой на себя и от себя — амплитуда 5–10°, почти незаметно', reps: '10–12 повторений' },
  { zoneId: 'ankle_right', zoneName: 'Голеностоп правый', mode: 'micro', name: 'Микро-насос', description: 'Очень маленькое движение правой стопой на себя и от себя — амплитуда 5–10°, почти незаметно', reps: '10–12 повторений' },
  { zoneId: 'fingers_foot_left', zoneName: 'Пальцы левой ноги', mode: 'micro', name: 'Микросжатие', description: 'Едва заметно сожмите пальцы левой стопы — совсем чуть-чуть. Расслабьте полностью', reps: '8–10 повторений' },
  { zoneId: 'fingers_foot_right', zoneName: 'Пальцы правой ноги', mode: 'micro', name: 'Микросжатие', description: 'Едва заметно сожмите пальцы правой стопы — совсем чуть-чуть. Расслабьте полностью', reps: '8–10 повторений' },
  { zoneId: 'neck', zoneName: 'Шея', mode: 'micro', name: 'Микронаклоны', description: 'Наклоните голову вправо на 5–10 мм, вернитесь. Затем влево. Медленно, без усилия', reps: '6–8 наклонов в каждую сторону' },
  { zoneId: 'upper_back', zoneName: 'Верх спины', mode: 'micro', name: 'Микролодочка', description: 'Лёжа на животе, едва поднимите плечи на 1–2 см от поверхности. Задержите, опустите', reps: '6–8 повторений' },
  { zoneId: 'lower_back', zoneName: 'Поясница', mode: 'micro', name: 'Микрокошка', description: 'На четвереньках: очень лёгкое округление поясницы вверх — всего на 1 см. Вернитесь в нейтраль', reps: '6–8 повторений' },

  // ── VIBRO (30 BPM, изометрия) ──
  { zoneId: 'shoulder_left', zoneName: 'Плечо левое', mode: 'vibro', name: 'Напряжение дельты', description: 'Напрягите мышцы левого плеча — как будто хотите поднять руку, но не двигаетесь. 2 удара напряжение, 2 удара отдых', reps: '5–6 циклов' },
  { zoneId: 'shoulder_right', zoneName: 'Плечо правое', mode: 'vibro', name: 'Напряжение дельты', description: 'Напрягите мышцы правого плеча — как будто хотите поднять руку, но не двигаетесь. 2 удара напряжение, 2 удара отдых', reps: '5–6 циклов' },
  { zoneId: 'elbow_left', zoneName: 'Локоть левый', mode: 'vibro', name: 'Напряжение бицепса и трицепса', description: 'Напрягите обе мышцы левого локтя одновременно — как будто давите рукой на воображаемое препятствие. Рука неподвижна', reps: '5–6 циклов' },
  { zoneId: 'elbow_right', zoneName: 'Локоть правый', mode: 'vibro', name: 'Напряжение бицепса и трицепса', description: 'Напрягите обе мышцы правого локтя одновременно — как будто давите рукой на воображаемое препятствие. Рука неподвижна', reps: '5–6 циклов' },
  { zoneId: 'wrist_left', zoneName: 'Кисть левая', mode: 'vibro', name: 'Напряжение предплечья', description: 'Напрягите мышцы левого предплечья, кисть неподвижна. Как будто удерживаете тяжёлый предмет', reps: '5–6 циклов' },
  { zoneId: 'wrist_right', zoneName: 'Кисть правая', mode: 'vibro', name: 'Напряжение предплечья', description: 'Напрягите мышцы правого предплечья, кисть неподвижна. Как будто удерживаете тяжёлый предмет', reps: '5–6 циклов' },
  { zoneId: 'fingers_hand_left', zoneName: 'Пальцы левой руки', mode: 'vibro', name: 'Напряжение без движения', description: 'Как будто хотите сжать левый кулак изо всех сил — но пальцы не двигаются. Мышцы напряжены', reps: '5–6 циклов' },
  { zoneId: 'fingers_hand_right', zoneName: 'Пальцы правой руки', mode: 'vibro', name: 'Напряжение без движения', description: 'Как будто хотите сжать правый кулак изо всех сил — но пальцы не двигаются. Мышцы напряжены', reps: '5–6 циклов' },
  { zoneId: 'hip_left', zoneName: 'Тазобедренный левый', mode: 'vibro', name: 'Напряжение ягодиц', description: 'Напрягите ягодичную мышцу левой стороны — сожмите, как будто удерживаете монетку. Тело неподвижно', reps: '5–6 циклов' },
  { zoneId: 'hip_right', zoneName: 'Тазобедренный правый', mode: 'vibro', name: 'Напряжение ягодиц', description: 'Напрягите ягодичную мышцу правой стороны — сожмите, как будто удерживаете монетку. Тело неподвижно', reps: '5–6 циклов' },
  { zoneId: 'knee_left', zoneName: 'Колено левое', mode: 'vibro', name: 'Напряжение квадрицепса', description: 'Напрягите мышцу передней поверхности левого бедра — нога выпрямляется мысленно, но не двигается', reps: '5–6 циклов' },
  { zoneId: 'knee_right', zoneName: 'Колено правое', mode: 'vibro', name: 'Напряжение квадрицепса', description: 'Напрягите мышцу передней поверхности правого бедра — нога выпрямляется мысленно, но не двигается', reps: '5–6 циклов' },
  { zoneId: 'ankle_left', zoneName: 'Голеностоп левый', mode: 'vibro', name: 'Напряжение голени', description: 'Напрягите икроножную мышцу левой ноги — как будто встаёте на носок, но не двигаетесь. Стопа неподвижна', reps: '5–6 циклов' },
  { zoneId: 'ankle_right', zoneName: 'Голеностоп правый', mode: 'vibro', name: 'Напряжение голени', description: 'Напрягите икроножную мышцу правой ноги — как будто встаёте на носок, но не двигаетесь. Стопа неподвижна', reps: '5–6 циклов' },
  { zoneId: 'fingers_foot_left', zoneName: 'Пальцы левой ноги', mode: 'vibro', name: 'Напряжение стопы', description: 'Напрягите всю левую стопу — пальцы как будто хотят сжаться, но остаются неподвижными', reps: '5–6 циклов' },
  { zoneId: 'fingers_foot_right', zoneName: 'Пальцы правой ноги', mode: 'vibro', name: 'Напряжение стопы', description: 'Напрягите всю правую стопу — пальцы как будто хотят сжаться, но остаются неподвижными', reps: '5–6 циклов' },
  { zoneId: 'neck', zoneName: 'Шея', mode: 'vibro', name: 'Напряжение мышц шеи', description: 'Слегка напрягите мышцы шеи — как будто кто-то мягко давит на лоб, а вы сопротивляетесь. Голова неподвижна', reps: '5–6 циклов' },
  { zoneId: 'upper_back', zoneName: 'Верх спины', mode: 'vibro', name: 'Напряжение мышц спины', description: 'Сведите лопатки и напрягите мышцы верхней спины — как будто удерживаете карандаш между лопаток', reps: '5–6 циклов' },
  { zoneId: 'lower_back', zoneName: 'Поясница', mode: 'vibro', name: 'Напряжение поясницы', description: 'Напрягите мышцы поясницы — слегка прижмите поясницу к спинке стула или к полу. Тело не движется', reps: '5–6 циклов' },
];

export function getExercisesForMode(mode: ExerciseMode, zoneStates: Record<string, ZoneState>): Exercise[] {
  const result: Exercise[] = [];
  
  ZONES.forEach(zone => {
    const state = zoneStates[zone.id] || { pain: 'none', mobility: 'full', configured: false };
    const color = getZoneColor(state);
    
    let exerciseMode: 'normal' | 'micro' | 'vibro' | null = null;
    
    switch (mode) {
      case 'normal':
        exerciseMode = 'normal';
        break;
      case 'mixedA':
        if (color === 'red') exerciseMode = null;
        else exerciseMode = 'normal';
        break;
      case 'mixedB':
        if (color === 'yellow') exerciseMode = 'micro';
        else if (color === 'red') exerciseMode = null;
        else exerciseMode = 'normal';
        break;
      case 'totalMicro':
        exerciseMode = 'micro';
        break;
      case 'totalVibro':
        exerciseMode = 'vibro';
        break;
    }
    
    if (exerciseMode) {
      const ex = EXERCISES.find(e => e.zoneId === zone.id && e.mode === exerciseMode);
      if (ex) result.push(ex);
    }
  });
  
  return result;
}