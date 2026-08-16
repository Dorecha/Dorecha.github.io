function renderSvgMap(missionId) {
            
            
            // Common Grid and border measurements
            const grid = `
                <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#27272a" stroke-width="0.5"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <text x="150" y="10" class="map-label" text-anchor="middle">30 ДЮЙМОВ (ДЛИННАЯ СТОРОНА)</text>
                <text x="-110" y="10" class="map-label" transform="rotate(-90)" text-anchor="middle">22 ДЮЙМА</text>
            `;

            let innerSvg = '';

            switch (missionId) {
                case 'm1': // Диагональный
                    innerSvg = `
                        <polygon points="0,0 100,0 0,100" fill="#2563eb" fill-opacity="0.3" stroke="#3b82f6" stroke-width="1.5"/>
                        <text x="25" y="35" fill="#93c5fd" font-size="10" font-weight="bold">Игрок А</text>
                        <polygon points="300,220 200,220 300,120" fill="#dc2626" fill-opacity="0.3" stroke="#ef4444" stroke-width="1.5"/>
                        <text x="240" y="195" fill="#fca5a5" font-size="10" font-weight="bold">Игрок Б</text>
                        <circle cx="70" cy="150" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        <circle cx="123" cy="110" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        <circle cx="177" cy="110" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        <circle cx="230" cy="70" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                    `;
                    break;
                case 'm2': // Короткий Край
                    innerSvg = `
                        <rect x="0" y="0" width="60" height="220" fill="#2563eb" fill-opacity="0.3" stroke="#3b82f6" stroke-width="1.5"/>
                        <text x="30" y="115" fill="#93c5fd" font-size="10" font-weight="bold" text-anchor="middle" transform="rotate(-90 30,115)">Игрок А (6")</text>
                        <rect x="240" y="0" width="60" height="220" fill="#dc2626" fill-opacity="0.3" stroke="#ef4444" stroke-width="1.5"/>
                        <text x="270" y="115" fill="#fca5a5" font-size="10" font-weight="bold" text-anchor="middle" transform="rotate(-90 270,115)">Игрок Б (6")</text>
                        <line x1="150" y1="0" x2="150" y2="220" stroke="#f59e0b" stroke-dasharray="4" opacity="0.3" stroke-width="1"/>
                        <circle cx="100" cy="60" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        <circle cx="100" cy="160" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        <circle cx="200" cy="60" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        <circle cx="200" cy="160" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                    `;
                    break;
                case 'm3': // Загрузка Данных
                    innerSvg = `
                        <rect x="0" y="0" width="300" height="60" fill="#2563eb" fill-opacity="0.3" stroke="#3b82f6" stroke-width="1.5"/>
                        <text x="150" y="35" fill="#93c5fd" font-size="10" font-weight="bold" text-anchor="middle">Игрок А (6")</text>
                        <rect x="0" y="160" width="300" height="60" fill="#dc2626" fill-opacity="0.3" stroke="#ef4444" stroke-width="1.5"/>
                        <text x="150" y="195" fill="#fca5a5" font-size="10" font-weight="bold" text-anchor="middle">Игрок Б (6")</text>
                        <circle cx="100" cy="90" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        <circle cx="200" cy="90" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        <circle cx="100" cy="130" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        <circle cx="200" cy="130" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                    `;
                    break;
                case 'm4': // Ценные Грузы
                    innerSvg = `
                        <rect x="0" y="0" width="300" height="60" fill="#2563eb" fill-opacity="0.3" stroke="#3b82f6" stroke-width="1.5"/>
                        <text x="150" y="35" fill="#93c5fd" font-size="10" font-weight="bold" text-anchor="middle">Игрок А (6")</text>
                        <rect x="0" y="160" width="300" height="60" fill="#dc2626" fill-opacity="0.3" stroke="#ef4444" stroke-width="1.5"/>
                        <text x="150" y="195" fill="#fca5a5" font-size="10" font-weight="bold" text-anchor="middle">Игрок Б (6")</text>
                        <line x1="0" y1="110" x2="300" y2="110" stroke="#f59e0b" stroke-dasharray="4" opacity="0.3" stroke-width="1"/>
                        <rect x="70" y="105" width="10" height="10" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        <rect x="145" y="105" width="10" height="10" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        <rect x="220" y="105" width="10" height="10" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                    `;
                    break;
                case 'm5': // Сдвиг Зоны
                    innerSvg = `
                        <rect x="0" y="0" width="300" height="60" fill="#2563eb" fill-opacity="0.3" stroke="#3b82f6" stroke-width="1.5"/>
                        <text x="150" y="35" fill="#93c5fd" font-size="10" font-weight="bold" text-anchor="middle">Игрок А (6")</text>
                        <rect x="0" y="160" width="300" height="60" fill="#dc2626" fill-opacity="0.3" stroke="#ef4444" stroke-width="1.5"/>
                        <text x="150" y="195" fill="#fca5a5" font-size="10" font-weight="bold" text-anchor="middle">Игрок Б (6")</text>
                        <circle cx="90" cy="80" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        <circle cx="210" cy="80" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        <circle cx="150" cy="110" r="9" fill="#f59e0b" stroke="#fff" stroke-width="2"/>
                        <circle cx="90" cy="140" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        <circle cx="210" cy="140" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                    `;
                    break;
                case 'm6': // Штурм Бункера
                    innerSvg = `
                        <rect x="0" y="0" width="300" height="40" fill="#2563eb" fill-opacity="0.3" stroke="#3b82f6" stroke-width="1.5"/>
                        <text x="150" y="25" fill="#93c5fd" font-size="10" font-weight="bold" text-anchor="middle">Игрок А (Узкая 4")</text>
                        <rect x="0" y="180" width="300" height="40" fill="#dc2626" fill-opacity="0.3" stroke="#ef4444" stroke-width="1.5"/>
                        <text x="150" y="205" fill="#fca5a5" font-size="10" font-weight="bold" text-anchor="middle">Игрок Б (Узкая 4")</text>
                        <rect x="110" y="70" width="80" height="80" fill="#27272a" stroke="#52525b" stroke-width="2" rx="4"/>
                        <text x="150" y="105" fill="#71717a" font-size="9" font-family="sans-serif" font-weight="bold" text-anchor="middle">БУНКЕР</text>
                        <circle cx="60" cy="110" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        <circle cx="150" cy="125" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        <circle cx="240" cy="110" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                    `;
                    break;
                case 'm7': // Контроль Линий
                    innerSvg = `
                        <rect x="0" y="0" width="300" height="60" fill="#2563eb" fill-opacity="0.3" stroke="#3b82f6" stroke-width="1.5"/>
                        <text x="150" y="35" fill="#93c5fd" font-size="10" font-weight="bold" text-anchor="middle">Игрок А (6")</text>
                        <rect x="0" y="160" width="300" height="60" fill="#dc2626" fill-opacity="0.3" stroke="#ef4444" stroke-width="1.5"/>
                        <text x="150" y="195" fill="#fca5a5" font-size="10" font-weight="bold" text-anchor="middle">Игрок Б (6")</text>
                        <circle cx="90" cy="110" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        <circle cx="150" cy="75" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        <circle cx="150" cy="145" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        <circle cx="210" cy="110" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                    `;
                    break;
                case 'm8': // Царь Горы
                    innerSvg = `
                        <rect x="0" y="0" width="300" height="60" fill="#2563eb" fill-opacity="0.3" stroke="#3b82f6" stroke-width="1.5"/>
                        <text x="150" y="35" fill="#93c5fd" font-size="10" font-weight="bold" text-anchor="middle">Игрок А (6")</text>
                        <rect x="0" y="160" width="300" height="60" fill="#dc2626" fill-opacity="0.3" stroke="#ef4444" stroke-width="1.5"/>
                        <text x="150" y="195" fill="#fca5a5" font-size="10" font-weight="bold" text-anchor="middle">Игрок Б (6")</text>
                        <circle cx="150" cy="110" r="10" fill="#f59e0b" stroke="#fff" stroke-width="2"/>
                        <circle cx="150" cy="110" r="4" fill="#fff" />
                    `;
                    break;
                case 'm9': // Поля Глушения (Шахматная)
                    innerSvg = `
                        <!-- Player A: Top-Left & Bottom-Right -->
                        <rect x="0" y="0" width="80" height="80" fill="#2563eb" fill-opacity="0.3" stroke="#3b82f6" stroke-width="1.5"/>
                        <text x="40" y="45" fill="#93c5fd" font-size="10" font-weight="bold" text-anchor="middle">А</text>
                        <rect x="220" y="140" width="80" height="80" fill="#2563eb" fill-opacity="0.3" stroke="#3b82f6" stroke-width="1.5"/>
                        <text x="260" y="185" fill="#93c5fd" font-size="10" font-weight="bold" text-anchor="middle">А</text>
                        
                        <!-- Player B: Top-Right & Bottom-Left -->
                        <rect x="220" y="0" width="80" height="80" fill="#dc2626" fill-opacity="0.3" stroke="#ef4444" stroke-width="1.5"/>
                        <text x="260" y="45" fill="#fca5a5" font-size="10" font-weight="bold" text-anchor="middle">Б</text>
                        <rect x="0" y="140" width="80" height="80" fill="#dc2626" fill-opacity="0.3" stroke="#ef4444" stroke-width="1.5"/>
                        <text x="40" y="185" fill="#fca5a5" font-size="10" font-weight="bold" text-anchor="middle">Б</text>

                        <!-- Points forming a cross in the center -->
                        <circle cx="150" cy="70" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        <circle cx="150" cy="150" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        <circle cx="110" cy="110" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        <circle cx="190" cy="110" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        
                        <!-- Jamming Radius indicators (dotted circles) -->
                        <circle cx="150" cy="70" r="25" fill="none" stroke="#f59e0b" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.5"/>
                        <circle cx="150" cy="150" r="25" fill="none" stroke="#f59e0b" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.5"/>
                        <circle cx="110" cy="110" r="25" fill="none" stroke="#f59e0b" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.5"/>
                        <circle cx="190" cy="110" r="25" fill="none" stroke="#f59e0b" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.5"/>
                    `;
                    break;
                case 'm10': // Асимметричный Саботаж
                    innerSvg = `
                        <!-- Defender Box in Center -->
                        <rect x="100" y="60" width="100" height="100" fill="#2563eb" fill-opacity="0.3" stroke="#3b82f6" stroke-width="1.5"/>
                        <text x="150" y="115" fill="#93c5fd" font-size="10" font-weight="bold" text-anchor="middle">ЗАЩИТНИК</text>
                        
                        <!-- Attacker Corners -->
                        <polygon points="0,0 80,0 0,80" fill="#dc2626" fill-opacity="0.3" stroke="#ef4444" stroke-width="1.5"/>
                        <text x="25" y="25" fill="#fca5a5" font-size="9" font-weight="bold">АТАКА</text>
                        <polygon points="300,220 220,220 300,140" fill="#dc2626" fill-opacity="0.3" stroke="#ef4444" stroke-width="1.5"/>
                        <text x="255" y="200" fill="#fca5a5" font-size="9" font-weight="bold">АТАКА</text>

                        <!-- Generators (Objectives) in Defender box -->
                        <rect x="115" y="75" width="10" height="10" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        <rect x="175" y="75" width="10" height="10" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        <rect x="145" y="135" width="10" height="10" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                    `;
                    break;
                case 'm11': // Токсичный Шторм
                    innerSvg = `
                        <rect x="0" y="0" width="300" height="60" fill="#2563eb" fill-opacity="0.3" stroke="#3b82f6" stroke-width="1.5"/>
                        <text x="150" y="35" fill="#93c5fd" font-size="10" font-weight="bold" text-anchor="middle">Игрок А (6")</text>
                        <rect x="0" y="160" width="300" height="60" fill="#dc2626" fill-opacity="0.3" stroke="#ef4444" stroke-width="1.5"/>
                        <text x="150" y="195" fill="#fca5a5" font-size="10" font-weight="bold" text-anchor="middle">Игрок Б (6")</text>
                        
                        <!-- Death Zone Warning Border -->
                        <rect x="30" y="30" width="240" height="160" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="8 4"/>
                        <text x="150" y="55" fill="#ef4444" font-size="9" font-weight="bold" text-anchor="middle">СМЕРТЕЛЬНАЯ ЗОНА (от 3-го хода)</text>

                        <!-- Points clumped in center -->
                        <circle cx="130" cy="95" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        <circle cx="170" cy="95" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        <circle cx="130" cy="125" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                        <circle cx="170" cy="125" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                    `;
                    break;
                case 'm12': // Изменчивый Фронт (Рандом)
                    innerSvg = `
                        <polygon points="0,0 100,0 0,100" fill="#2563eb" fill-opacity="0.3" stroke="#3b82f6" stroke-width="1.5"/>
                        <text x="25" y="35" fill="#93c5fd" font-size="10" font-weight="bold">Игрок А</text>
                        <polygon points="300,220 200,220 300,120" fill="#dc2626" fill-opacity="0.3" stroke="#ef4444" stroke-width="1.5"/>
                        <text x="240" y="195" fill="#fca5a5" font-size="10" font-weight="bold">Игрок Б</text>
                        
                        <!-- 6 Numbered Objectives scattered -->
                        <circle cx="80" cy="170" r="9" fill="#f59e0b" stroke="#fff" stroke-width="1"/>
                        <text x="80" y="173" fill="#fff" font-size="8" font-weight="bold" text-anchor="middle">1</text>
                        
                        <circle cx="70" cy="70" r="9" fill="#f59e0b" stroke="#fff" stroke-width="1"/>
                        <text x="70" y="73" fill="#fff" font-size="8" font-weight="bold" text-anchor="middle">2</text>
                        
                        <circle cx="150" cy="110" r="9" fill="#f59e0b" stroke="#fff" stroke-width="1"/>
                        <text x="150" y="113" fill="#fff" font-size="8" font-weight="bold" text-anchor="middle">3</text>
                        
                        <circle cx="230" cy="150" r="9" fill="#f59e0b" stroke="#fff" stroke-width="1"/>
                        <text x="230" y="153" fill="#fff" font-size="8" font-weight="bold" text-anchor="middle">4</text>
                        
                        <circle cx="220" cy="50" r="9" fill="#f59e0b" stroke="#fff" stroke-width="1"/>
                        <text x="220" y="53" fill="#fff" font-size="8" font-weight="bold" text-anchor="middle">5</text>
                        
                        <circle cx="150" cy="30" r="9" fill="#f59e0b" stroke="#fff" stroke-width="1"/>
                        <text x="150" y="33" fill="#fff" font-size="8" font-weight="bold" text-anchor="middle">6</text>
                    `;
                    break;
            }

            return `<svg viewBox="0 0 300 220" class="w-full h-full">${grid}${innerSvg}</svg>`;
        }

export { renderSvgMap };
