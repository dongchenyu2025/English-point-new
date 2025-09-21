// Scene data service - manages all scene and vocabulary data
class SceneDataService {
    constructor() {
        this.scenes = {
            kitchen: {
                id: 'kitchen',
                name: 'Kitchen',
                image: 'src/assets/images/scenes/kitchen.jpg',
                vocabulary: [
                    {
                        word: 'oven',
                        phonetic: '/oven/',
                        chinese: 'oven',
                        audio: 'src/assets/audio/oven.MP3',
                        position: { x: '30.07%', y: '27.50%' }
                    },
                    {
                        word: 'pendant light',
                        phonetic: '/pendant light/',
                        chinese: 'pendant light',
                        audio: 'src/assets/audio/pendant _light.MP3',
                        position: { x: '61.96%', y: '22.08%' }
                    },
                    {
                        word: 'stove',
                        phonetic: '/stove/',
                        chinese: 'stove',
                        audio: 'src/assets/audio/stove.MP3',
                        position: { x: '71.98%', y: '44.16%' }
                    },
                    {
                        word: 'kitchen island',
                        phonetic: '/kitchen island/',
                        chinese: 'kitchen island',
                        audio: 'src/assets/audio/kitchen_island.MP3',
                        position: { x: '36.75%', y: '55.25%' }
                    },
                    {
                        word: 'stool',
                        phonetic: '/stool/',
                        chinese: 'stool',
                        audio: 'src/assets/audio/stool.MP3',
                        position: { x: '61.66%', y: '81.83%' }
                    }
                ]
            },
            living: {
                id: 'living',
                name: 'Living Room',
                image: 'src/assets/images/scenes/living.jpg',
                vocabulary: [
                    {
                        word: 'cushion',
                        phonetic: '/ˈkʊʃən/',
                        chinese: '靠垫',
                        audio: 'src/assets/audio/Cushion.MP3',
                        position: { x: '69.46%', y: '57.33%' }
                    },
                    {
                        word: 'blanket',
                        phonetic: '/ˈblæŋkɪt/',
                        chinese: '毯子',
                        audio: 'src/assets/audio/Blanket.MP3',
                        position: { x: '63.63%', y: '79.91%' }
                    },
                    {
                        word: 'blind',
                        phonetic: '/blaɪnd/',
                        chinese: '窗帘/卷帘',
                        audio: 'src/assets/audio/Blind.MP3',
                        position: { x: '70.19%', y: '34.08%' }
                    },
                    {
                        word: 'shelf',
                        phonetic: '/ʃɛlf/',
                        chinese: '架子',
                        audio: 'src/assets/audio/Shelf.MP3',
                        position: { x: '27.92%', y: '37.41%' }
                    },
                    {
                        word: 'rug',
                        phonetic: '/rʌɡ/',
                        chinese: '地毯',
                        audio: 'src/assets/audio/Rug.MP3',
                        position: { x: '28.94%', y: '82.66%' }
                    },
                    {
                        word: 'washing machine',
                        phonetic: '/ˈwɑːʃɪŋ məˌʃiːn/',
                        chinese: '洗衣机',
                        audio: 'src/assets/audio/Washing_machine.MP3',
                        position: { x: '53.99%', y: '34.00%' }
                    }
                ]
            },
            park: {
                id: 'park',
                name: 'Park',
                image: 'src/assets/images/scenes/park.jpg',
                vocabulary: [
                    {
                        word: 'bench',
                        phonetic: '/bɛntʃ/',
                        chinese: '长椅',
                        audio: 'src/assets/audio/Bench.MP3',
                        position: { x: '39.03%', y: '71.91%' }
                    },
                    {
                        word: 'fountain',
                        phonetic: '/ˈfaʊntɪn/',
                        chinese: '喷泉',
                        audio: 'src/assets/audio/Fountain.MP3',
                        position: { x: '38.12%', y: '46.83%' }
                    },
                    {
                        word: 'swing',
                        phonetic: '/swɪŋ/',
                        chinese: '秋千',
                        audio: 'src/assets/audio/Swing.MP3',
                        position: { x: '20.80%', y: '55.41%' }
                    },
                    {
                        word: 'slide',
                        phonetic: '/slaɪd/',
                        chinese: '滑梯',
                        audio: 'src/assets/audio/Slide.MP3',
                        position: { x: '75.63%', y: '52.16%' }
                    },
                    {
                        word: 'lawn',
                        phonetic: '/lɔːn/',
                        chinese: '草坪',
                        audio: 'src/assets/audio/Lawn.MP3',
                        position: { x: '61.05%', y: '57.16%' }
                    }
                ]
            },
            desk: {
                id: 'desk',
                name: 'Desk',
                image: 'src/assets/images/scenes/desk.jpg',
                vocabulary: [
                    {
                        word: 'monitor',
                        phonetic: '/ˈmɒnɪtər/',
                        chinese: '显示器',
                        audio: 'src/assets/audio/Monitor.MP3',
                        position: { x: '65.91%', y: '58.83%' }
                    },
                    {
                        word: 'keyboard',
                        phonetic: '/ˈkiːbɔːrd/',
                        chinese: '键盘',
                        audio: 'src/assets/audio/Keyboard.MP3',
                        position: { x: '49.81%', y: '89.75%' }
                    },
                    {
                        word: 'mouse',
                        phonetic: '/maʊs/',
                        chinese: '鼠标',
                        audio: 'src/assets/audio/Mouse.MP3',
                        position: { x: '78.66%', y: '92.16%' }
                    },
                    {
                        word: 'headphones',
                        phonetic: '/ˈhɛdˌfoʊnz/',
                        chinese: '耳机',
                        audio: 'src/assets/audio/Headphones.MP3',
                        position: { x: '24.45%', y: '63.00%' }
                    },
                    {
                        word: 'calendar',
                        phonetic: '/ˈkæləndər/',
                        chinese: '日历',
                        audio: 'src/assets/audio/calendar.MP3',
                        position: { x: '26.42%', y: '86.00%' }
                    }
                ]
            },
            coffee: {
                id: 'coffee',
                name: 'Coffee',
                image: 'src/assets/images/scenes/coffee.jpg',
                vocabulary: [
                    {
                        word: 'dirty coffee',
                        phonetic: '/ˈdɜːrti ˈkɒfi/',
                        chinese: '脏咖啡',
                        audio: 'src/assets/audio/dirty_Coffee.MP3',
                        position: { x: '33.71%', y: '64.33%' }
                    },
                    {
                        word: 'latte',
                        phonetic: '/ˈlɑːteɪ/',
                        chinese: '拿铁',
                        audio: 'src/assets/audio/latte.MP3',
                        position: { x: '59.98%', y: '72.50%' }
                    },
                    {
                        word: 'americano',
                        phonetic: '/mɛrɪˈkɑːnoʊ/',
                        chinese: '美式咖啡',
                        audio: 'src/assets/audio/americano.MP3',
                        position: { x: '55.28%', y: '31.58%' }
                    }
                ]
            },
            supermarket: {
                id: 'supermarket',
                name: 'Supermarket',
                image: 'src/assets/images/scenes/supermarket.jpg',
                vocabulary: [
                    {
                        word: 'lettuce',
                        phonetic: '/ˈlɛtəs/',
                        chinese: '生菜',
                        audio: 'src/assets/audio/lettuce.MP3',
                        position: { x: '34.91%', y: '18.66%' }
                    },
                    {
                        word: 'cucumber',
                        phonetic: '/ˈkjuːkʌmbər/',
                        chinese: '黄瓜',
                        audio: 'src/assets/audio/cucumber.MP3',
                        position: { x: '30.10%', y: '52.66%' }
                    },
                    {
                        word: 'bell pepper',
                        phonetic: '/ˈbɛl ˌpɛpər/',
                        chinese: '甜椒',
                        audio: 'src/assets/audio/bell_pepper.MP3',
                        position: { x: '58.97%', y: '42.41%' }
                    },
                    {
                        word: 'cabbage',
                        phonetic: '/ˈkæbɪdʒ/',
                        chinese: '卷心菜',
                        audio: 'src/assets/audio/cabbage.MP3',
                        position: { x: '70.48%', y: '86.50%' }
                    },
                    {
                        word: 'eggplant',
                        phonetic: '/ˈɛɡˌplænt/',
                        chinese: '茄子',
                        audio: 'src/assets/audio/eggplant.MP3',
                        position: { x: '33.89%', y: '63.16%' }
                    }
                ]
            },
            take_a_flight: {
                id: 'take_a_flight',
                name: 'Take a flight',
                image: 'src/assets/images/scenes/take_a_flight.jpg',
                vocabulary: [
                    {
                        word: 'passenger',
                        phonetic: '/ˈpæsɪndʒər/',
                        chinese: '乘客',
                        audio: 'src/assets/audio/passenger.MP3',
                        position: { x: '47.45%', y: '63.08%' }
                    },
                    {
                        word: 'aisle',
                        phonetic: '/aɪl/',
                        chinese: '过道',
                        audio: 'src/assets/audio/aisle.MP3',
                        position: { x: '64.94%', y: '83.75%' }
                    },
                    {
                        word: 'flight attendant',
                        phonetic: '/ˈflaɪt əˈtendənt/',
                        chinese: '航班空乘',
                        audio: 'src/assets/audio/flight_attendant.MP3',
                        position: { x: '62.32%', y: '35.75%' }
                    },
                    {
                        word: 'tray table',
                        phonetic: '/ˈtreɪ ˈteɪbl/',
                        chinese: '小桌板',
                        audio: 'src/assets/audio/tray_table.MP3',
                        position: { x: '41.03%', y: '79.08%' }
                    },
                    {
                        word: 'overhead bin',
                        phonetic: '/ˌoʊvərˈhed bɪn/',
                        chinese: '行李舱',
                        audio: 'src/assets/audio/overhead_bin.MP3',
                        position: { x: '43.08%', y: '28.91%' }
                    }
                ]
            },
            check_in: {
                id: 'check_in',
                name: 'Check in',
                image: 'src/assets/images/scenes/check_in.jpg',
                vocabulary: [
                    {
                        word: 'boarding gate',
                        phonetic: '/ˈbɔːrdɪŋ ɡeɪt/',
                        chinese: '登机口',
                        audio: 'src/assets/audio/boarding_gate.MP3',
                        position: { x: '78.79%', y: '32.33%' }
                    },
                    {
                        word: 'boarding pass',
                        phonetic: '/ˈbɔːrdɪŋ pɑːs/',
                        chinese: '登机牌',
                        audio: 'src/assets/audio/boarding_pass.MP3',
                        position: { x: '48.76%', y: '39.08%' }
                    },
                    {
                        word: 'flight number',
                        phonetic: '/flaɪt ˈnʌmbər/',
                        chinese: '航班号',
                        audio: 'src/assets/audio/flight_number.MP3',
                        position: { x: '48.47%', y: '15.83%' }
                    },
                    {
                        word: 'passport',
                        phonetic: '/ˈpæspɔːrt/',
                        chinese: '护照',
                        audio: 'src/assets/audio/passport.MP3',
                        position: { x: '57.07%', y: '47.08%' }
                    },
                    {
                        word: 'checked baggage',
                        phonetic: '/tʃekt ˈbæɡɪdʒ/',
                        chinese: '托运行李',
                        audio: 'src/assets/audio/checked_baggage.MP3',
                        position: { x: '66.11%', y: '86.25%' }
                    }
                ]
            },
        };
    }

    getScene(sceneId) {
        return this.scenes[sceneId] || null;
    }

    getAllScenes() {
        return Object.values(this.scenes);
    }
}

// Initialize global instance
window.sceneDataService = new SceneDataService();