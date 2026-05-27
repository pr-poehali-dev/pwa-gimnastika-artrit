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
  { id: 'fingers_hand', name: 'Пальцы рук', shortName: 'Пальцы рук', side: 'center', group: 'upper' },
  { id: 'hip_left', name: 'Левый тазобедренный', shortName: 'Таз Л', side: 'left', group: 'lower' },
  { id: 'hip_right', name: 'Правый тазобедренный', shortName: 'Таз П', side: 'right', group: 'lower' },
  { id: 'knee_left', name: 'Левое колено', shortName: 'Колено Л', side: 'left', group: 'lower' },
  { id: 'knee_right', name: 'Правое колено', shortName: 'Колено П', side: 'right', group: 'lower' },
  { id: 'ankle_left', name: 'Левый голеностоп', shortName: 'Голено Л', side: 'left', group: 'lower' },
  { id: 'ankle_right', name: 'Правый голеностоп', shortName: 'Голено П', side: 'right', group: 'lower' },
  { id: 'fingers_foot', name: 'Пальцы ног', shortName: 'Пальцы ног', side: 'center', group: 'lower' },
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
  mixedB: { name: 'Смешанный Б', bpm: 70, icon: '🐢', color: '#f59e0b', description: 'Осторожные суставы — микродвижения, здоровые — умеренно' },
  totalMicro: { name: 'Тотальный микро', bpm: 40, icon: '🐢', color: '#f97316', description: 'Только микродвижения для всех суставов' },
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
  // NORMAL
  { zoneId: 'shoulder_left', zoneName: 'Плечо левое', mode: 'normal', name: 'Маятник', description: 'Наклонитесь вперёд, рука свободно раскачивается как маятник', reps: '10 качаний' },
  { zoneId: 'shoulder_right', zoneName: 'Плечо правое', mode: 'normal', name: 'Маятник', description: 'Наклонитесь вперёд, рука свободно раскачивается как маятник', reps: '10 качаний' },
  { zoneId: 'elbow_left', zoneName: 'Локоть левый', mode: 'normal', name: 'Сгибание-разгибание', description: 'Медленно сгибайте и разгибайте руку в локте', reps: '10 повторений' },
  { zoneId: 'elbow_right', zoneName: 'Локоть правый', mode: 'normal', name: 'Сгибание-разгибание', description: 'Медленно сгибайте и разгибайте руку в локте', reps: '10 повторений' },
  { zoneId: 'wrist_left', zoneName: 'Кисть левая', mode: 'normal', name: 'Круговые движения', description: 'Вращайте кистью по часовой и против часовой стрелки', reps: '8 кругов в каждую сторону' },
  { zoneId: 'wrist_right', zoneName: 'Кисть правая', mode: 'normal', name: 'Круговые движения', description: 'Вращайте кистью по часовой и против часовой стрелки', reps: '8 кругов в каждую сторону' },
  { zoneId: 'fingers_hand', zoneName: 'Пальцы рук', mode: 'normal', name: 'Веер', description: 'Медленно раскрывайте и закрывайте пальцы как веер', reps: '10 повторений' },
  { zoneId: 'hip_left', zoneName: 'Тазобедренный левый', mode: 'normal', name: 'Подъём ноги лёжа', description: 'Лёжа на спине, медленно поднимайте прямую ногу до 45°', reps: '8 повторений' },
  { zoneId: 'hip_right', zoneName: 'Тазобедренный правый', mode: 'normal', name: 'Подъём ноги лёжа', description: 'Лёжа на спине, медленно поднимайте прямую ногу до 45°', reps: '8 повторений' },
  { zoneId: 'knee_left', zoneName: 'Колено левое', mode: 'normal', name: 'Сгибание сидя', description: 'Сидя на стуле, медленно сгибайте и разгибайте ногу', reps: '10 повторений' },
  { zoneId: 'knee_right', zoneName: 'Колено правое', mode: 'normal', name: 'Сгибание сидя', description: 'Сидя на стуле, медленно сгибайте и разгибайте ногу', reps: '10 повторений' },
  { zoneId: 'ankle_left', zoneName: 'Голеностоп левый', mode: 'normal', name: 'Насос', description: 'Тяните носок на себя и от себя как насос', reps: '15 повторений' },
  { zoneId: 'ankle_right', zoneName: 'Голеностоп правый', mode: 'normal', name: 'Насос', description: 'Тяните носок на себя и от себя как насос', reps: '15 повторений' },
  { zoneId: 'fingers_foot', zoneName: 'Пальцы ног', mode: 'normal', name: 'Сжатие-разжатие', description: 'Медленно сжимайте и разжимайте пальцы ног', reps: '10 повторений' },
  { zoneId: 'neck', zoneName: 'Шея', mode: 'normal', name: 'Наклоны головы', description: 'Медленно наклоняйте голову вправо-влево, вперёд-назад', reps: '5 наклонов в каждую сторону' },
  { zoneId: 'upper_back', zoneName: 'Верх спины', mode: 'normal', name: 'Лодочка', description: 'Лёжа на животе, поднимайте руки и плечи на 5-10 см', reps: '8 повторений' },
  { zoneId: 'lower_back', zoneName: 'Поясница', mode: 'normal', name: 'Кошка-верблюд', description: 'На четвереньках: округляйте спину (кошка) и прогибайте (верблюд)', reps: '8 повторений' },

  // MICRO
  { zoneId: 'shoulder_left', zoneName: 'Плечо левое', mode: 'micro', name: 'Пожимание плечом', description: 'Поднимайте плечо на 1-2 см, задержите и опустите', reps: '10 повторений' },
  { zoneId: 'shoulder_right', zoneName: 'Плечо правое', mode: 'micro', name: 'Пожимание плечом', description: 'Поднимайте плечо на 1-2 см, задержите и опустите', reps: '10 повторений' },
  { zoneId: 'elbow_left', zoneName: 'Локоть левый', mode: 'micro', name: 'Микросгибание', description: 'Очень лёгкое сгибание на 5-10°, без усилия', reps: '10 повторений' },
  { zoneId: 'elbow_right', zoneName: 'Локоть правый', mode: 'micro', name: 'Микросгибание', description: 'Очень лёгкое сгибание на 5-10°, без усилия', reps: '10 повторений' },
  { zoneId: 'wrist_left', zoneName: 'Кисть левая', mode: 'micro', name: 'Микросжатие', description: 'Едва заметное сжатие кисти, без напряжения', reps: '10 повторений' },
  { zoneId: 'wrist_right', zoneName: 'Кисть правая', mode: 'micro', name: 'Микросжатие', description: 'Едва заметное сжатие кисти, без напряжения', reps: '10 повторений' },
  { zoneId: 'fingers_hand', zoneName: 'Пальцы рук', mode: 'micro', name: 'Микровеер', description: 'Слегка раздвигайте пальцы на 1-2 мм', reps: '10 повторений' },
  { zoneId: 'hip_left', zoneName: 'Тазобедренный левый', mode: 'micro', name: 'Скольжение пяткой', description: 'Лёжа, скользите пяткой по поверхности на 10-15 см', reps: '8 повторений' },
  { zoneId: 'hip_right', zoneName: 'Тазобедренный правый', mode: 'micro', name: 'Скольжение пяткой', description: 'Лёжа, скользите пяткой по поверхности на 10-15 см', reps: '8 повторений' },
  { zoneId: 'knee_left', zoneName: 'Колено левое', mode: 'micro', name: 'Микровыпрямление', description: 'Сидя, очень лёгкое выпрямление на 5-10°', reps: '10 повторений' },
  { zoneId: 'knee_right', zoneName: 'Колено правое', mode: 'micro', name: 'Микровыпрямление', description: 'Сидя, очень лёгкое выпрямление на 5-10°', reps: '10 повторений' },
  { zoneId: 'ankle_left', zoneName: 'Голеностоп левый', mode: 'micro', name: 'Микро-насос', description: 'Движение стопой на 5-10°, очень мягко', reps: '12 повторений' },
  { zoneId: 'ankle_right', zoneName: 'Голеностоп правый', mode: 'micro', name: 'Микро-насос', description: 'Движение стопой на 5-10°, очень мягко', reps: '12 повторений' },
  { zoneId: 'fingers_foot', zoneName: 'Пальцы ног', mode: 'micro', name: 'Микросжатие', description: 'Едва заметное сжатие пальцев стопы', reps: '10 повторений' },
  { zoneId: 'neck', zoneName: 'Шея', mode: 'micro', name: 'Микронаклоны', description: 'Наклон головы на 5-10 мм в каждую сторону', reps: '8 повторений' },
  { zoneId: 'upper_back', zoneName: 'Верх спины', mode: 'micro', name: 'Микролодочка', description: 'Едва поднимайте плечи на 1-2 см от поверхности', reps: '8 повторений' },
  { zoneId: 'lower_back', zoneName: 'Поясница', mode: 'micro', name: 'Микрокошка', description: 'Очень лёгкое округление поясницы на 1 см', reps: '8 повторений' },

  // VIBRO
  { zoneId: 'shoulder_left', zoneName: 'Плечо левое', mode: 'vibro', name: 'Напряжение дельты', description: 'Напрягите мышцы плеча без движения — 2 сек напряжение, 2 сек отдых', reps: '10 повторений' },
  { zoneId: 'shoulder_right', zoneName: 'Плечо правое', mode: 'vibro', name: 'Напряжение дельты', description: 'Напрягите мышцы плеча без движения — 2 сек напряжение, 2 сек отдых', reps: '10 повторений' },
  { zoneId: 'elbow_left', zoneName: 'Локоть левый', mode: 'vibro', name: 'Напряжение бицепса', description: 'Напрягите бицепс без сгибания руки', reps: '10 повторений' },
  { zoneId: 'elbow_right', zoneName: 'Локоть правый', mode: 'vibro', name: 'Напряжение бицепса', description: 'Напрягите бицепс без сгибания руки', reps: '10 повторений' },
  { zoneId: 'wrist_left', zoneName: 'Кисть левая', mode: 'vibro', name: 'Напряжение предплечья', description: 'Напрягите предплечье, рука неподвижна', reps: '10 повторений' },
  { zoneId: 'wrist_right', zoneName: 'Кисть правая', mode: 'vibro', name: 'Напряжение предплечья', description: 'Напрягите предплечье, рука неподвижна', reps: '10 повторений' },
  { zoneId: 'fingers_hand', zoneName: 'Пальцы рук', mode: 'vibro', name: 'Напряжение без движения', description: 'Как будто хотите сжать кулак, но не сжимаете', reps: '10 повторений' },
  { zoneId: 'hip_left', zoneName: 'Тазобедренный левый', mode: 'vibro', name: 'Напряжение ягодиц', description: 'Напрягите ягодичную мышцу — 2 сек, отдых 2 сек', reps: '10 повторений' },
  { zoneId: 'hip_right', zoneName: 'Тазобедренный правый', mode: 'vibro', name: 'Напряжение ягодиц', description: 'Напрягите ягодичную мышцу — 2 сек, отдых 2 сек', reps: '10 повторений' },
  { zoneId: 'knee_left', zoneName: 'Колено левое', mode: 'vibro', name: 'Напряжение квадрицепса', description: 'Напрягите мышцу бедра, нога не двигается', reps: '10 повторений' },
  { zoneId: 'knee_right', zoneName: 'Колено правое', mode: 'vibro', name: 'Напряжение квадрицепса', description: 'Напрягите мышцу бедра, нога не двигается', reps: '10 повторений' },
  { zoneId: 'ankle_left', zoneName: 'Голеностоп левый', mode: 'vibro', name: 'Напряжение голени', description: 'Напрягите икроножную мышцу без движения стопы', reps: '10 повторений' },
  { zoneId: 'ankle_right', zoneName: 'Голеностоп правый', mode: 'vibro', name: 'Напряжение голени', description: 'Напрягите икроножную мышцу без движения стопы', reps: '10 повторений' },
  { zoneId: 'fingers_foot', zoneName: 'Пальцы ног', mode: 'vibro', name: 'Напряжение стопы', description: 'Напрягите всю стопу, пальцы неподвижны', reps: '10 повторений' },
  { zoneId: 'neck', zoneName: 'Шея', mode: 'vibro', name: 'Напряжение шеи', description: 'Слегка напрягите мышцы шеи, голова неподвижна — 2 сек', reps: '10 повторений' },
  { zoneId: 'upper_back', zoneName: 'Верх спины', mode: 'vibro', name: 'Напряжение спины', description: 'Сведите лопатки и напрягите мышцы спины', reps: '10 повторений' },
  { zoneId: 'lower_back', zoneName: 'Поясница', mode: 'vibro', name: 'Напряжение поясницы', description: 'Напрягите поясничные мышцы без прогиба', reps: '10 повторений' },
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
