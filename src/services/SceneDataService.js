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
                        audio: 'src/assets/audio/oven.mp3',
                        position: { x: '30.07%', y: '27.50%' }
                    },
                    {
                        word: 'pendant light',
                        phonetic: '/pendant light/',
                        chinese: 'pendant light',
                        audio: 'src/assets/audio/pendant_light.mp3',
                        position: { x: '61.96%', y: '22.08%' }
                    },
                    {
                        word: 'stove',
                        phonetic: '/stove/',
                        chinese: 'stove',
                        audio: 'src/assets/audio/stove.mp3',
                        position: { x: '71.98%', y: '44.16%' }
                    },
                    {
                        word: 'kitchen island',
                        phonetic: '/kitchen island/',
                        chinese: 'kitchen island',
                        audio: 'src/assets/audio/kitchen_island.mp3',
                        position: { x: '36.75%', y: '55.25%' }
                    },
                    {
                        word: 'stool',
                        phonetic: '/stool/',
                        chinese: 'stool',
                        audio: 'src/assets/audio/stool.mp3',
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
                        word: 'Cushion',
                        phonetic: '/ˈkʊʃən/',
                        chinese: '靠垫',
                        audio: 'src/assets/audio/cushion.mp3',
                        position: { x: '69.46%', y: '57.33%' }
                    },
                    {
                        word: 'Blanket',
                        phonetic: '/ˈblæŋkɪt/',
                        chinese: '毯子',
                        audio: 'src/assets/audio/blanket.mp3',
                        position: { x: '63.63%', y: '79.91%' }
                    },
                    {
                        word: 'Blind',
                        phonetic: '/blaɪnd/',
                        chinese: '窗帘/卷帘',
                        audio: 'src/assets/audio/blind.mp3',
                        position: { x: '70.19%', y: '34.08%' }
                    },
                    {
                        word: 'Shelf',
                        phonetic: '/ʃɛlf/',
                        chinese: '架子',
                        audio: 'src/assets/audio/shelf.mp3',
                        position: { x: '27.92%', y: '37.41%' }
                    },
                    {
                        word: 'Rug',
                        phonetic: '/rʌɡ/',
                        chinese: '地毯',
                        audio: 'src/assets/audio/rug.mp3',
                        position: { x: '28.94%', y: '82.66%' }
                    },
                    {
                        word: 'Washing machine',
                        phonetic: '/ˈwɑːʃɪŋ məˌʃiːn/',
                        chinese: '洗衣机',
                        audio: 'src/assets/audio/washing_machine.mp3',
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
                        word: 'Bench',
                        phonetic: '/bɛntʃ/',
                        chinese: '长椅',
                        audio: 'src/assets/audio/bench.mp3',
                        position: { x: '39.03%', y: '71.91%' }
                    },
                    {
                        word: 'Fountain',
                        phonetic: '/ˈfaʊntɪn/',
                        chinese: '喷泉',
                        audio: 'src/assets/audio/fountain.mp3',
                        position: { x: '38.12%', y: '46.83%' }
                    },
                    {
                        word: 'Swing',
                        phonetic: '/swɪŋ/',
                        chinese: '秋千',
                        audio: 'src/assets/audio/swing.mp3',
                        position: { x: '20.80%', y: '55.41%' }
                    },
                    {
                        word: 'Slide',
                        phonetic: '/slaɪd/',
                        chinese: '滑梯',
                        audio: 'src/assets/audio/slide.mp3',
                        position: { x: '75.63%', y: '52.16%' }
                    },
                    {
                        word: 'Lawn',
                        phonetic: '/lɔːn/',
                        chinese: '草坪',
                        audio: 'src/assets/audio/lawn.mp3',
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
                        word: 'Monitor',
                        phonetic: '/ˈmɒnɪtər/',
                        chinese: '显示器',
                        audio: 'src/assets/audio/monitor.mp3',
                        position: { x: '65.91%', y: '58.83%' }
                    },
                    {
                        word: 'Keyboard',
                        phonetic: '/ˈkiːbɔːrd/',
                        chinese: '键盘',
                        audio: 'src/assets/audio/keyboard.mp3',
                        position: { x: '49.81%', y: '89.75%' }
                    },
                    {
                        word: 'Mouse',
                        phonetic: '/maʊs/',
                        chinese: '鼠标',
                        audio: 'src/assets/audio/mouse.mp3',
                        position: { x: '78.66%', y: '92.16%' }
                    },
                    {
                        word: 'Headphones',
                        phonetic: '/ˈhɛdˌfoʊnz/',
                        chinese: '耳机',
                        audio: 'src/assets/audio/headphones.mp3',
                        position: { x: '24.45%', y: '63.00%' }
                    },
                    {
                        word: 'Calendar',
                        phonetic: '/ˈkæləndər/',
                        chinese: '日历',
                        audio: 'src/assets/audio/calendar.mp3',
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
                        word: 'Dirty Coffee',
                        phonetic: '/ˈdɜːrti ˈkɒfi/',
                        chinese: '脏咖啡',
                        audio: 'src/assets/audio/dirty_coffee.mp3',
                        position: { x: '33.71%', y: '64.33%' }
                    },
                    {
                        word: 'Latte',
                        phonetic: '/ˈlɑːteɪ/',
                        chinese: '拿铁',
                        audio: 'src/assets/audio/latte.mp3',
                        position: { x: '59.98%', y: '72.50%' }
                    },
                    {
                        word: 'Americano',
                        phonetic: '/mɛrɪˈkɑːnoʊ/',
                        chinese: '美式咖啡',
                        audio: 'src/assets/audio/americano.mp3',
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
                        word: 'Lettuce',
                        phonetic: '/ˈlɛtəs/',
                        chinese: '生菜',
                        audio: 'src/assets/audio/lettuce.mp3',
                        position: { x: '34.91%', y: '18.66%' }
                    },
                    {
                        word: 'Cucumber',
                        phonetic: '/ˈkjuːkʌmbər/',
                        chinese: '黄瓜',
                        audio: 'src/assets/audio/cucumber.mp3',
                        position: { x: '30.10%', y: '52.66%' }
                    },
                    {
                        word: 'Bell pepper',
                        phonetic: '/ˈbɛl ˌpɛpər/',
                        chinese: '甜椒',
                        audio: 'src/assets/audio/bell_pepper.mp3',
                        position: { x: '58.97%', y: '42.41%' }
                    },
                    {
                        word: 'Cabbage',
                        phonetic: '/ˈkæbɪdʒ/',
                        chinese: '卷心菜',
                        audio: 'src/assets/audio/cabbage.mp3',
                        position: { x: '70.48%', y: '86.50%' }
                    },
                    {
                        word: 'Eggplant',
                        phonetic: '/ˈɛɡˌplænt/',
                        chinese: '茄子',
                        audio: 'src/assets/audio/eggplant.mp3',
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
                        word: 'Passenger',
                        phonetic: '/ˈpæsɪndʒər/',
                        chinese: '乘客',
                        audio: 'src/assets/audio/passenger.mp3',
                        position: { x: '47.45%', y: '63.08%' }
                    },
                    {
                        word: 'Aisle',
                        phonetic: '/aɪl/',
                        chinese: '过道',
                        audio: 'src/assets/audio/aisle.mp3',
                        position: { x: '64.94%', y: '83.75%' }
                    },
                    {
                        word: 'Flight attendant',
                        phonetic: '/ˈflaɪt əˈtendənt/',
                        chinese: '航班空乘',
                        audio: 'src/assets/audio/flight_attendant.mp3',
                        position: { x: '62.32%', y: '35.75%' }
                    },
                    {
                        word: 'Tray table',
                        phonetic: '/ˈtreɪ ˈteɪbl/',
                        chinese: '小桌板',
                        audio: 'src/assets/audio/tray_table.mp3',
                        position: { x: '41.03%', y: '79.08%' }
                    },
                    {
                        word: 'Overhead bin',
                        phonetic: '/ˌoʊvərˈhed bɪn/',
                        chinese: '行李舱',
                        audio: 'src/assets/audio/overhead_bin.mp3',
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
                        word: 'Boarding gate',
                        phonetic: '/ˈbɔːrdɪŋ ɡeɪt/',
                        chinese: '登机口',
                        audio: 'src/assets/audio/boarding_gate.mp3',
                        position: { x: '78.79%', y: '32.33%' }
                    },
                    {
                        word: 'Boarding pass',
                        phonetic: '/ˈbɔːrdɪŋ pɑːs/',
                        chinese: '登机牌',
                        audio: 'src/assets/audio/boarding_pass.mp3',
                        position: { x: '48.76%', y: '39.08%' }
                    },
                    {
                        word: 'Flight number',
                        phonetic: '/flaɪt ˈnʌmbər/',
                        chinese: '航班号',
                        audio: 'src/assets/audio/flight_number.mp3',
                        position: { x: '48.47%', y: '15.83%' }
                    },
                    {
                        word: 'Passport',
                        phonetic: '/ˈpæspɔːrt/',
                        chinese: '护照',
                        audio: 'src/assets/audio/passport.mp3',
                        position: { x: '57.07%', y: '47.08%' }
                    },
                    {
                        word: 'Checked baggage',
                        phonetic: '/tʃekt ˈbæɡɪdʒ/',
                        chinese: '托运行李',
                        audio: 'src/assets/audio/checked_baggage.mp3',
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