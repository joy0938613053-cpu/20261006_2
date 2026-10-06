//// 宣告測驗題目陣列，儲存五道 p5.js 指令題目
const questions = [
  {
    // 設定第一題題目文字
    question: "在 p5.js 中，哪一個函式只會在程式開始時執行一次？",
    // 設定第一題的四個選項
    options: ["draw()", "setup()", "mousePressed()", "windowResized()"],
    // 設定正確答案的索引值，索引 1 代表第二個選項
    answer: 1,
    // 設定答對後顯示的解釋
    explanation: "setup() 通常用來設定畫布大小、顏色與初始資料，而且只會執行一次。"
  },
  {
    // 設定第二題題目文字
    question: "在 p5.js 中，哪一個函式會不斷重複執行？",
    // 設定第二題的四個選項
    options: ["setup()", "draw()", "preload()", "createCanvas()"],
    // 設定正確答案的索引值
    answer: 1,
    // 設定答對後顯示的解釋
    explanation: "draw() 預設會持續重複執行，適合用來製作動畫與互動效果。"
  },
  {
    // 設定第三題題目文字
    question: "哪一個 p5.js 指令可以建立畫布？",
    // 設定第三題的四個選項
    options: ["createCanvas()", "makeScreen()", "drawCanvas()", "newCanvas()"],
    // 設定正確答案的索引值
    answer: 0,
    // 設定答對後顯示的解釋
    explanation: "createCanvas() 可以建立 p5.js 的繪圖畫布，常放在 setup() 中使用。"
  },
  {
    // 設定第四題題目文字
    question: "在 p5.js 中，哪一個指令可以畫出圓形或橢圓形？",
    // 設定第四題的四個選項
    options: ["rect()", "line()", "ellipse()", "triangle()"],
    // 設定正確答案的索引值
    answer: 2,
    // 設定答對後顯示的解釋
    explanation: "ellipse() 可以繪製圓形或橢圓形，格式通常是 ellipse(x, y, 寬度, 高度)。"
  },
  {
    // 設定第五題題目文字
    question: "在 p5.js 中，哪一個函式可以偵測滑鼠被按下？",
    // 設定第五題的四個選項
    options: ["mousePressed()", "mouseClicked()", "keyPressed()", "touchStarted()"],
    // 設定第五題的正確答案索引值
    answer: 0,
    // 設定第五題的解釋文字
    explanation: "mousePressed() 會在滑鼠按鍵被按下時執行，可以用來製作滑鼠互動功能。"
  }
];

// 設定目前顯示的題目編號
let currentQuestion = 0;

// 設定答對的題數
let correctCount = 0;

// 設定使用者目前選取的選項
let selectedOption = -1;

// 設定目前題目是否已經作答
let hasAnswered = false;

// 設定是否已經完成全部測驗
let quizFinished = false;

// 設定選項按鈕的範圍資料
let optionBoxes = [];

// 設定下一題按鈕的範圍資料
let nextButton = { x: 0, y: 0, w: 0, h: 0 };

// 設定重新測驗按鈕的範圍資料
let restartButton = { x: 0, y: 0, w: 0, h: 0 };

// 設定畫布的背景顏色
const BACKGROUND_COLOR = "#f8f9fa";

// 設定主要文字顏色
const TEXT_COLOR = "#14213d";

// 設定標題顏色
const TITLE_COLOR = "#0077b6";

// 設定正確答案的背景顏色
const CORRECT_COLOR = "#caf0f8";

// 設定錯誤答案的背景顏色
const WRONG_COLOR = "#ffccd5";

// 設定按鈕背景顏色
const BUTTON_COLOR = "#ffd166";

// 設定按鈕文字顏色
const BUTTON_TEXT_COLOR = "#14213d";

// 設定一般選項背景顏色
const OPTION_COLOR = "#ffffff";

// 設定選項邊框顏色
const BORDER_COLOR = "#90a4ae";

// 設定畫布左右邊界間距
const SIDE_MARGIN = 40;

// 設定畫布上下邊界間距
const TOP_MARGIN = 30;

// 設定選項之間的垂直間距
const OPTION_GAP = 16;

// 設定選項圓角大小
const OPTION_RADIUS = 14;

// 設定按鈕圓角大小
const BUTTON_RADIUS = 16;

// 建立畫布並設定文字顯示方式
function setup() {
  // 建立符合瀏覽器視窗大小的全螢幕畫布
  createCanvas(windowWidth, windowHeight);

  // 設定文字水平置中對齊
  textAlign(CENTER, CENTER);

  // 設定文字垂直置中對齊
  textFont("sans-serif");

  // 設定畫布不顯示外框
  noStroke();

  // 設定畫布使用像素密度，讓高解析度螢幕顯示更清楚
  pixelDensity(displayDensity());

  // 設定畫布背景顏色
  background(BACKGROUND_COLOR);
}

// 每一幀都會執行的主要繪圖函式
function draw() {
  // 清除畫面並填入背景顏色
  background(BACKGROUND_COLOR);

  // 判斷測驗是否已經完成
  if (quizFinished) {
    // 如果完成測驗，就繪製結果畫面
    drawResultScreen();

    // 結束本次 draw() 執行
    return;
  }

  // 繪製測驗標題
  drawHeader();

  // 繪製目前題目與四個選項
  drawQuestionScreen();
}

// 繪製測驗標題與進度資訊
function drawHeader() {
  // 計算適合目前畫面寬度的標題文字大小
  const titleSize = constrain(width * 0.035, 24, 42);

  // 設定標題文字大小
  textSize(titleSize);

  // 設定標題文字粗細
  textStyle(BOLD);

  // 設定標題文字顏色
  fill(TITLE_COLOR);

  // 在畫布上方繪製主標題
  text("p5.js 程式設計指令測驗", width / 2, TOP_MARGIN + titleSize / 2);

  // 計算適合目前畫面寬度的進度文字大小
  const progressSize = constrain(width * 0.018, 16, 24);

  // 設定進度文字大小
  textSize(progressSize);

  // 設定一般字體粗細
  textStyle(NORMAL);

  // 設定進度文字顏色
  fill(TEXT_COLOR);

  // 建立目前題數的文字
  const progressText = `第 ${currentQuestion + 1} 題，共 ${questions.length} 題`;

  // 在標題下方顯示題目進度
  text(progressText, width / 2, TOP_MARGIN + titleSize + 28);
}

// 繪製目前題目畫面
function drawQuestionScreen() {
  // 取得目前題目的資料
  const questionData = questions[currentQuestion];

  // 計算題目文字大小
  const questionSize = constrain(width * 0.026, 20, 32);

  // 設定題目文字大小
  textSize(questionSize);

  // 設定題目文字粗細
  textStyle(BOLD);

  // 設定題目文字顏色
  fill(TEXT_COLOR);

  // 設定題目區塊的最大寬度
  const questionWidth = min(width - SIDE_MARGIN * 2, 1000);

  // 設定題目區塊的高度
  const questionHeight = 100;

  // 設定題目區塊的左上角位置
  const questionX = width / 2 - questionWidth / 2;

  // 設定題目區塊的上方位置
  const questionY = max(125, height * 0.18);

  // 設定題目區塊的背景顏色
  fill("#e9f5db");

  // 繪製題目背景區塊
  rect(questionX, questionY, questionWidth, questionHeight, OPTION_RADIUS);

  // 設定題目文字顏色
  fill(TEXT_COLOR);

  // 設定題目文字區塊寬度
  const textWidth = questionWidth - 40;

  // 繪製題目文字，使用自動換行
  drawWrappedText(
    questionData.question,
    width / 2,
    questionY + questionHeight / 2,
    textWidth,
    questionSize * 1.25
  );

  // 設定選項區塊寬度
  const optionWidth = min(width - SIDE_MARGIN * 2, 900);

  // 計算每個選項區塊高度
  const optionHeight = max(58, min(86, height * 0.085));

  // 計算所有選項的總高度
  const totalOptionHeight =
    optionHeight * questionData.options.length +
    OPTION_GAP * (questionData.options.length - 1);

  // 計算選項第一個區塊的起始位置
  const firstOptionY = questionY + questionHeight + 28;

  // 清空選項區塊陣列
  optionBoxes = [];

  // 逐一繪製四個選項
  for (let i = 0; i < questionData.options.length; i++) {
    // 計算目前選項的原始垂直位置
    let optionY = firstOptionY + i * (optionHeight + OPTION_GAP);

    // 設定目前選項的上下跳動位移量
    let jumpOffset = 0;

    // 判斷是否需要讓正確選項上下跳動
    if (
      hasAnswered &&
      selectedOption !== questionData.answer &&
      i === questionData.answer
    ) {
      // 使用 sin() 製作平滑的上下跳動動畫
      jumpOffset = sin(frameCount * 0.12) * 8;
    }

    // 將動畫位移套用到選項位置
    optionY += jumpOffset;

    // 建立目前選項的範圍資料
    const optionBox = {
      x: width / 2 - optionWidth / 2,
      y: optionY,
      w: optionWidth,
      h: optionHeight
    };

    // 將選項範圍加入陣列
    optionBoxes.push(optionBox);

    // 根據答題狀態決定選項背景顏色
    let optionColor = OPTION_COLOR;

    // 判斷目前是否已經作答
    if (hasAnswered) {
      // 判斷目前選項是否是正確答案
      if (i === questionData.answer) {
        // 正確答案使用指定的淡藍色背景
        optionColor = CORRECT_COLOR;
      }

      // 判斷目前選項是否是使用者選取的錯誤答案
      if (i === selectedOption && selectedOption !== questionData.answer) {
        // 錯誤選項使用淡紅色背景
        optionColor = WRONG_COLOR;
      }
    }

    // 設定選項背景顏色
    fill(optionColor);

    // 設定選項邊框顏色
    stroke(BORDER_COLOR);

    // 設定選項邊框粗細
    strokeWeight(2);

    // 繪製選項背景區塊
    rect(optionBox.x, optionBox.y, optionBox.w, optionBox.h, OPTION_RADIUS);

    // 移除後續繪圖的邊框
    noStroke();

    // 設定選項文字顏色
    fill(TEXT_COLOR);

    // 設定選項文字大小
    textSize(constrain(width * 0.019, 16, 24));

    // 設定選項文字粗細
    textStyle(NORMAL);

    // 建立選項前方的英文字母
    const optionLabel = String.fromCharCode(65 + i);

    // 建立完整選項文字
    const optionText = `${optionLabel}. ${questionData.options[i]}`;

    // 繪製選項文字
    drawWrappedText(
      optionText,
      width / 2,
      optionBox.y + optionBox.h / 2,
      optionBox.w - 36,
      28
    );
  }

  // 判斷使用者是否已經完成這一題
  if (hasAnswered) {
    // 計算提示文字區塊的垂直位置
    const feedbackY = firstOptionY + totalOptionHeight + 28;

    // 繪製答題結果訊息
    drawFeedback(feedbackY);

    // 繪製下一題按鈕
    drawNextButton();
  }
}

// 繪製答題結果與簡短說明
function drawFeedback(feedbackY) {
  // 取得目前題目的資料
  const questionData = questions[currentQuestion];

  // 判斷使用者是否答對
  const isCorrect = selectedOption === questionData.answer;

  // 設定提示區塊寬度
  const feedbackWidth = min(width - SIDE_MARGIN * 2, 900);

  // 設定提示區塊高度
  const feedbackHeight = 82;

  // 設定提示區塊背景顏色
  fill(isCorrect ? "#d8f3dc" : "#ffe5ec");

  // 繪製提示區塊
  rect(
    width / 2 - feedbackWidth / 2,
    feedbackY,
    feedbackWidth,
    feedbackHeight,
    OPTION_RADIUS
  );

  // 設定提示文字顏色
  fill(TEXT_COLOR);

  // 設定提示文字大小
  textSize(constrain(width * 0.017, 15, 22));

  // 設定提示文字粗細
  textStyle(BOLD);

  // 建立答題結果文字
  const resultText = isCorrect
    ? "答對了！"
    : "答錯了！藍色跳動的選項是正確答案。";

  // 顯示答題結果文字
  text(resultText, width / 2, feedbackY + 25);

  // 設定解析文字大小
  textSize(constrain(width * 0.014, 13, 18));

  // 設定解析文字粗細
  textStyle(NORMAL);

  // 顯示題目解析
  drawWrappedText(
    questionData.explanation,
    width / 2,
    feedbackY + 56,
    feedbackWidth - 32,
    22
  );
}

// 繪製下一題按鈕
function drawNextButton() {
  // 設定按鈕寬度
  const buttonWidth = min(width - SIDE_MARGIN * 2, 240);

  // 設定按鈕高度
  const buttonHeight = 54;

  // 設定按鈕的水平位置
  const buttonX = width / 2 - buttonWidth / 2;

  // 設定按鈕的垂直位置
  const buttonY = height - 86;

  // 儲存下一題按鈕的範圍
  nextButton = {
    x: buttonX,
    y: buttonY,
    w: buttonWidth,
    h: buttonHeight
  };

  // 設定按鈕背景顏色
  fill(BUTTON_COLOR);

  // 繪製按鈕背景
  rect(buttonX, buttonY, buttonWidth, buttonHeight, BUTTON_RADIUS);

  // 設定按鈕文字顏色
  fill(BUTTON_TEXT_COLOR);

  // 設定按鈕文字大小
  textSize(20);

  // 設定按鈕文字粗細
  textStyle(BOLD);

  // 判斷是否為最後一題
  const buttonText =
    currentQuestion === questions.length - 1 ? "查看測驗結果" : "下一題";

  // 繪製按鈕文字
  text(buttonText, width / 2, buttonY + buttonHeight / 2);
}

// 繪製測驗完成結果畫面
function drawResultScreen() {
  // 設定結果畫面的標題文字大小
  const resultTitleSize = constrain(width * 0.05, 30, 64);

  // 設定結果標題文字大小
  textSize(resultTitleSize);

  // 設定結果標題文字粗細
  textStyle(BOLD);

  // 設定結果標題文字顏色
  fill(TITLE_COLOR);

  // 顯示測驗完成標題
  text("測驗完成！", width / 2, height * 0.25);

  // 設定分數文字大小
  textSize(constrain(width * 0.07, 42, 90));

  // 設定分數文字顏色
  fill(TEXT_COLOR);

  // 顯示答對題數
  text(`${correctCount} / ${questions.length}`, width / 2, height * 0.45);

  // 設定說明文字大小
  textSize(constrain(width * 0.022, 18, 30));

  // 設定說明文字粗細
  textStyle(NORMAL);

  // 設定說明文字顏色
  fill(TEXT_COLOR);

  // 顯示測驗結果說明
  text("答對題數", width / 2, height * 0.55);

  // 設定重新測驗按鈕寬度
  const buttonWidth = min(width - SIDE_MARGIN * 2, 260);

  // 設定重新測驗按鈕高度
  const buttonHeight = 58;

  // 設定重新測驗按鈕水平位置
  const buttonX = width / 2 - buttonWidth / 2;

  // 設定重新測驗按鈕垂直位置
  const buttonY = height * 0.68;

  // 儲存重新測驗按鈕範圍
  restartButton = {
    x: buttonX,
    y: buttonY,
    w: buttonWidth,
    h: buttonHeight
  };

  // 設定重新測驗按鈕背景顏色
  fill(BUTTON_COLOR);

  // 繪製重新測驗按鈕
  rect(buttonX, buttonY, buttonWidth, buttonHeight, BUTTON_RADIUS);

  // 設定重新測驗按鈕文字顏色
  fill(BUTTON_TEXT_COLOR);

  // 設定重新測驗按鈕文字大小
  textSize(21);

  // 設定重新測驗按鈕文字粗細
  textStyle(BOLD);

  // 顯示重新測驗文字
  text("重新測驗", width / 2, buttonY + buttonHeight / 2);
}

// 處理滑鼠按下事件
function mousePressed() {
  // 判斷測驗是否已經完成
  if (quizFinished) {
    // 判斷滑鼠是否點擊重新測驗按鈕
    if (isInsideButton(mouseX, mouseY, restartButton)) {
      // 將目前題目重設為第一題
      currentQuestion = 0;

      // 將答對題數歸零
      correctCount = 0;

      // 將選項選取狀態重設
      selectedOption = -1;

      // 將作答狀態重設
      hasAnswered = false;

      // 將完成狀態重設
      quizFinished = false;
    }

    // 結束結果畫面的滑鼠處理
    return;
  }

  // 取得目前題目的資料
  const questionData = questions[currentQuestion];

  // 判斷目前題目是否尚未作答
  if (!hasAnswered) {
    // 逐一檢查四個選項是否被點擊
    for (let i = 0; i < optionBoxes.length; i++) {
      // 取得目前選項的範圍
      const box = optionBoxes[i];

      // 判斷滑鼠是否位於目前選項範圍內
      if (isInsideButton(mouseX, mouseY, box)) {
        // 記錄使用者所選的選項
        selectedOption = i;

        // 設定題目已經作答
        hasAnswered = true;

        // 判斷使用者是否答對
        if (selectedOption === questionData.answer) {
          // 答對題數加一
          correctCount++;
        }

        // 結束選項檢查迴圈
        break;
      }
    }

    // 結束尚未作答的處理
    return;
  }

  // 判斷使用者是否點擊下一題按鈕
  if (isInsideButton(mouseX, mouseY, nextButton)) {
    // 判斷目前是否為最後一題
    if (currentQuestion === questions.length - 1) {
      // 設定測驗完成
      quizFinished = true;
    } else {
      // 前往下一題
      currentQuestion++;

      // 清除上一題的選項選取狀態
      selectedOption = -1;

      // 設定下一題尚未作答
      hasAnswered = false;
    }
  }
}

// 判斷滑鼠座標是否位於指定矩形範圍內
function isInsideButton(px, py, button) {
  // 回傳滑鼠是否位於矩形內
  return (
    px >= button.x &&
    px <= button.x + button.w &&
    py >= button.y &&
    py <= button.y + button.h
  );
}

// 繪製可以自動換行的文字
function drawWrappedText(message, centerX, centerY, maxWidth, lineHeight) {
  // 將文字內容依照空白切割成字詞
  const words = message.split(" ");

  // 建立儲存每一行文字的陣列
  const lines = [];

  // 建立目前正在組合的文字行
  let currentLine = "";

  // 逐一處理每個字詞
  for (let i = 0; i < words.length; i++) {
    // 建立加入下一個字詞後的測試文字
    const testLine =
      currentLine.length === 0
        ? words[i]
        : `${currentLine} ${words[i]}`;

    // 判斷測試文字是否超過最大寬度
    if (textWidth(testLine) > maxWidth && currentLine.length > 0) {
      // 將目前文字行加入行陣列
      lines.push(currentLine);

      // 讓下一行從目前字詞開始
      currentLine = words[i];
    } else {
      // 將測試文字設定為目前文字行
      currentLine = testLine;
    }
  }

  // 將最後一行文字加入行陣列
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  // 計算所有文字行的總高度
  const totalHeight = lines.length * lineHeight;

  // 計算第一行文字的垂直位置
  const firstLineY = centerY - totalHeight / 2 + lineHeight / 2;

  // 逐行繪製文字
  for (let i = 0; i < lines.length; i++) {
    // 計算目前文字行的垂直位置
    const lineY = firstLineY + i * lineHeight;

    // 繪製目前文字行
    text(lines[i], centerX, lineY);
  }
}

// 當瀏覽器視窗大小改變時執行
function windowResized() {
  // 重新調整畫布大小，使畫布維持全螢幕
  resizeCanvas(windowWidth, windowHeight);
}
