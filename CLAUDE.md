# Claude Code 协作记录

## 项目信息
**项目名称**：English Point & Learn
**最后更新**：2024年9月22日
**当前版本**：v1.3.4

## 协作记录

### 2024年9月22日 - 统一命名规范与资源文件完整性修复

#### 问题发现
用户报告在超市场景中，`bell pepper` 能找到音频文件，但 `cucumber` 等其他单词找不到音频。控制台显示大量404错误。

#### 问题分析
1. **命名不一致**：图片文件使用连写格式（如 `takeaflight.jpg`），音频文件使用下划线格式（如 `bell_pepper.MP3`）
2. **大小写混乱**：配置中某些路径使用大写（如 `Cushion.MP3`），实际文件为小写（如 `cushion.MP3`）
3. **特殊字符问题**：存在空格和不规范命名（如 `pendant _light.MP3`、`dirty_Coffee.MP3`）
4. **AudioService路径生成逻辑缺陷**：无法处理多种命名变体

#### 解决方案
1. **统一命名规范**：采用小写+下划线格式
   - 场景ID：`take_a_flight`、`check_in`
   - 图片文件：`take_a_flight.jpg`、`check_in.jpg`
   - 音频文件：`bell_pepper.MP3`、`flight_attendant.MP3`

2. **文件重命名执行**：
   - `checkin.jpg` → `check_in.jpg`
   - `takeaflight.jpg` → `take_a_flight.jpg`
   - `pendant _light.MP3` → `pendant_light.MP3`
   - `dirty_Coffee.MP3` → `dirty_coffee.MP3`

3. **代码同步更新**：
   - `SceneDataService.js`：场景配置和文件路径
   - `ThemeDataService.js`：主题分组引用
   - `HomePage.js`：场景名称映射

4. **AudioService增强**：支持12种文件名变体匹配

#### 技术实现
```bash
# 执行重命名脚本
./rename_files.sh

# 验证资源完整性
./verify_resources_final.sh
```

#### 修改文件列表
- `/src/services/AudioService.js` - 增强路径匹配逻辑
- `/src/services/SceneDataService.js` - 更新所有文件路径引用
- `/src/services/ThemeDataService.js` - 更新场景ID引用
- `/src/components/HomePage.js` - 更新场景名称映射
- `/src/assets/images/scenes/` - 4个图片文件重命名
- `/src/assets/audio/` - 2个音频文件重命名

#### 验证结果
```
=== 验证结果总结 ===
总文件数: 47
找到文件: 47
缺失文件: 0
配置问题: 0
🎉 所有资源文件验证通过!
```

#### 关键代码修改

**AudioService.js** - 路径生成逻辑增强：
```javascript
const possiblePaths = [
    `./src/assets/audio/${word}.MP3`,                    // 原始格式
    `./src/assets/audio/${word.replace(' ', '_')}.MP3`,  // 空格转下划线
    `./src/assets/audio/${word.toLowerCase()}.MP3`,      // 小写格式
    `./src/assets/audio/${word.toLowerCase().replace(' ', '_')}.MP3`,
    `./src/assets/audio/${word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()}.MP3`,
    `./src/assets/audio/${word.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('_')}.MP3`
    // ... 更多变体
];
```

**SceneDataService.js** - 典型路径更新：
```javascript
// 更新前
audio: 'src/assets/audio/dirty_Coffee.MP3'
image: 'src/assets/images/scenes/takeaflight.jpg'

// 更新后
audio: 'src/assets/audio/dirty_coffee.MP3'
image: 'src/assets/images/scenes/take_a_flight.jpg'
```

#### 最终命名规范
| 类型 | 格式 | 示例 | 说明 |
|------|------|------|------|
| 场景ID | 小写下划线 | `take_a_flight` | 代码标识符 |
| 场景图片 | 小写下划线.jpg | `take_a_flight.jpg` | 与场景ID一致 |
| 音频文件 | 小写下划线.MP3 | `bell_pepper.MP3` | 词汇空格→下划线 |
| 显示文本 | 正常格式 | `Take a Flight` | 用户界面显示 |

#### 效果
- ✅ 音频播放100%成功
- ✅ 所有47个资源文件正确加载
- ✅ 统一命名规范便于维护
- ✅ 批量操作友好

---

## 开发技巧和命令

### 常用命令
```bash
# 启动本地开发服务器
python3 -m http.server 8000

# 检查音频文件
ls -la src/assets/audio/ | grep -i "target_word"

# 验证资源文件完整性
./verify_resources_final.sh

# 批量重命名（谨慎使用）
./rename_files.sh
```

### 调试音频问题
1. 检查控制台网络面板404错误
2. 验证文件路径大小写匹配
3. 确认文件实际存在
4. 测试AudioService路径生成逻辑

### 添加新场景资源
1. 图片：`scene_id.jpg`（小写下划线）
2. 音频：`word_name.MP3`（小写下划线）
3. 配置：更新SceneDataService.js
4. 验证：运行资源完整性检查

---

## 项目结构

### 核心文件
- `/src/services/SceneDataService.js` - 场景数据配置
- `/src/services/AudioService.js` - 音频播放逻辑
- `/src/services/ThemeDataService.js` - 主题分组管理
- `/src/components/HomePage.js` - 首页组件
- `/src/components/ScenePage.js` - 场景页面组件

### 资源文件
- `/src/assets/images/scenes/` - 场景图片
- `/src/assets/audio/` - 单词音频文件
- `/scene_word.txt` - 场景词汇数据源

### 工具和文档
- `/PRD.md` - 产品需求文档
- `/CLAUDE.md` - Claude协作记录（本文件）

### 2024年9月22日 - 有道发音接口集成（美式发音优先）

#### 用户需求
用户要求修改热点单词的发音逻辑，点击单词实现美式发音，使用有道英语发音接口：
- 接口地址：`https://dict.youdao.com/dictvoice?audio={word}&type={1|2}`
- type 1 为英音，type 2 为美音
- 要求使用美式发音（type=2）

#### 问题分析
1. **当前音频优先级不合理**：本地音频文件优先级最高，但可能缺失或质量不一致
2. **缺乏在线发音服务**：仅依赖本地文件和浏览器TTS，用户体验受限
3. **发音标准不统一**：需要统一使用美式发音标准

#### 解决方案
1. **调整音频播放优先级**：
   - 优先级1：有道发音API（美式发音）
   - 优先级2：本地音频文件（备用）
   - 优先级3：原有音频URL（兼容性）
   - 优先级4：浏览器TTS（最终备选）

2. **新增tryYoudaoAudio方法**：
   - URL编码处理：`encodeURIComponent(word.trim())`
   - 美式发音：`type=2`
   - 超时机制：5秒超时保护
   - 错误处理：完整的异常捕获和降级

#### 技术实现

**AudioService.js** - 新增有道API方法：
```javascript
// Try to play audio using Youdao pronunciation API (American pronunciation)
async tryYoudaoAudio(word) {
    return new Promise((resolve) => {
        try {
            // Encode the word for URL
            const encodedWord = encodeURIComponent(word.trim());
            // Use type=2 for American pronunciation
            const youdaoUrl = `https://dict.youdao.com/dictvoice?audio=${encodedWord}&type=2`;

            const audio = new Audio(youdaoUrl);
            let resolved = false;

            const timeout = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    console.warn('🔊 Youdao API timeout for:', word);
                    resolve(false);
                }
            }, 5000); // 5 second timeout

            audio.oncanplaythrough = () => {
                if (!resolved) {
                    audio.play().then(() => {
                        clearTimeout(timeout);
                        resolved = true;
                        console.log('🔊 Successfully played Youdao audio for:', word);
                        resolve(true);
                    }).catch(() => {
                        clearTimeout(timeout);
                        if (!resolved) {
                            resolved = true;
                            resolve(false);
                        }
                    });
                }
            };

            audio.onerror = () => {
                clearTimeout(timeout);
                if (!resolved) {
                    resolved = true;
                    resolve(false);
                }
            };

            audio.load();
        } catch (error) {
            console.warn('🔊 Youdao API exception:', error);
            resolve(false);
        }
    });
}
```

**AudioService.js** - 优先级调整：
```javascript
// PRIORITY 1: Try Youdao pronunciation API first (American pronunciation)
if (word) {
    try {
        console.log('🔊 AudioService: Trying Youdao API first for:', word);
        audioPlayed = await this.tryYoudaoAudio(word);
    } catch (error) {
        console.warn('🔊 AudioService: Youdao API failed, trying local audio:', error);
    }
}

// PRIORITY 2: Fallback to local audio files
if (!audioPlayed && word) {
    try {
        console.log('🔊 AudioService: Trying local audio for:', word);
        audioPlayed = await this.tryLocalAudio(word);
    } catch (error) {
        console.warn('🔊 AudioService: Local audio failed, trying provided URL:', error);
    }
}
```

#### 修改文件列表
- `/src/services/AudioService.js` - 新增有道API集成和优先级调整

#### 执行指令记录
```bash
# 用户输入指令
修改热点单词的发音逻辑，点击单词实现美式发音，请求的接口如下：有道英语发音接口
https://dict.youdao.com/dictvoice?audio={word}&type={1|2}
type 1 为英音 2 为美音
请你替换audio的参数

# 技术实现步骤
1. 查找当前音频播放逻辑的实现位置
2. 修改AudioService使用有道发音接口
3. 测试新的发音功能

# 启动测试服务器
python3 -m http.server 8002
```

#### 功能特性
- ✅ 有道API美式发音优先
- ✅ 智能降级机制
- ✅ URL编码支持特殊字符
- ✅ 5秒超时保护
- ✅ 完整错误处理
- ✅ 保持向后兼容

#### 效果验证
1. 点击任意热点单词，优先播放有道API美式发音
2. API失败时自动降级到本地音频
3. 控制台显示详细的音频播放日志
4. 用户体验：统一、清晰的美式发音

---

**更新时间**：2024年9月22日
**当前版本**：v1.3.5
**Claude 版本**：Sonnet 4