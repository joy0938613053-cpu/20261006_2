// 儲存五道 p5.js 程式設計選擇題
const questions = [
  {
    // 設定第一題題目
    question: "在 p5.js 中，哪一個函式只會在程式開始時執行一次？",
    // 設定第一題的四個選項
    options: ["draw()", "setup()", "mousePressed()", "windowResized()"],
    // 設定正確答案索引
    answer: 1,
    // 設定第一題解析
    explanation: "setup() 通常用來設定畫布大小、顏色與初始資料，而且只會執行一次。"
  },
  {
    // 設定第二題題目
    question: "在 p5.js 中，哪一個函式會不斷重複執行？",
    // 設定第二題的四個選項
    options: ["setup()", "draw()", "preload()", "createCanvas()"],
    // 設定正確答案索引
    answer: 1,
    // 設定第二題解析
    explanation: "draw() 預設會持續重複執行，適合用來製作動畫與互動效果。"
  },
  {
    // 設定第三題題目
    question: "哪一個 p5.js 指令可以建立畫布？",
    // 設定第三題的四個選項
    options: ["createCanvas()", "makeScreen()", "drawCanvas()", "newCanvas()"],
    // 設定正確答案索引
    answer: 0,
    // 設定第三題解析
    explanation: "createCanvas() 可以建立 p5.js 的繪圖畫布，通常會放在 setup() 中使用。"
  },
  {
    // 設定第四題題目
    question: "在 p5.js 中，哪一個指令可以畫出圓形或橢圓形？",
    // 設定第四題的四個選項
    options: ["rect()", "line()", "ellipse()", "triangle()"],
    // 設定正確答案索引
    answer: 2,
    // 設定第四題解析
    explanation: "ellipse() 可以繪製圓形或橢圓形，格式為 ellipse(x, y, 寬度, 高度)。"
  },
  {
    // 設定第五題題目
    question: "在 p5.js 中，哪一個函式可以偵測滑鼠被按下？",
    // 設定第五題的四個選項
    options: ["mousePressed()", "mouseClicked()", "keyPressed()", "touchStarted()"],
    // 設定正確答案索引
    answer: 0,
    // 設定第五題解析
    explanation: "mousePressed() 會在滑鼠按鍵被按下時執行，可以用來製作滑鼠互動功能。"
  }
];

// 設定目前題目編號
let currentQuestion = 0;

// 設定答對題數
let correctCount = 0;

// 設定使用者選取的選項
let selectedOption = -1;

// 設定目前題目是否已作答
let hasAnswered = false;

// 設定測驗是否已完成
let quizFinished = false;

// 儲存選項按鈕位置
let optionBoxes = [];

// 儲存下一題按鈕位置
let nextButton = { x: 0, y: 0, w: 0, h: 0 };

// 儲存重新測驗按鈕位置
let restartButton = { x: 0, y: 0, w: 0, h: 0 };

// 設定目前畫面捲動位置
let scrollY = 0;

// 設定觸控開始位置
let touchStartY = 0;

// 設定觸控開始時的捲動位置
let touchStartScrollY = 0;

// 設定是否正在觸控滑動
let isTouching = false;

// 設定內容總高度
let contentHeight = 0;

// 設定畫面顏色
const COLORS = {
  // 設定背景顏色
  background: "#f8f9fa",

  // 設定主要文字顏色
  text: "#14213d",

  // 設定標題顏色
  title: "#0077b6",

  // 設定題目背景顏色
  question: "#e9f5db",

  // 設定一般選項背景顏色
  option: "#ffffff",

  // 設定正確答案背景顏色
  correct: "#caf0f8",

  // 設定錯誤答案背景顏色
  wrong: "#ffccd5",

  // 設定按鈕背景顏色
  button: "#ffd166",

  // 設定按鈕文字顏色
  buttonText: "#14213d",

  // 設定答對提示背景顏色
  success: "#d8f3dc",

  // 設定答錯提示背景顏色
  error: "#ffe5ec",

  // 設定邊框顏色
  border: "#90a4ae"
};

// p5.js 初始化函式
function setup() {
  // 建立符合瀏覽器視窗大小的畫布
  createCanvas(windowWidth, windowHeight);

  // 設定文字水平置中
  textAlign(CENTER, CENTER);

  // 設定文字垂直置中
  textBaseline(CENTER);

  // 設定文字字型
  textFont("sans-serif");

  // 設定畫布像素密度
  pixelDensity(displayDensity());

  // 設定觸控滑動時不讓瀏覽器捲動
  document.body.style.overflow = "hidden";

  // 建立第一次版面配置
  rebuildLayout();
}

// p5.js 每一幀執行的函式
function draw() {
  // 清除畫面並填入背景顏色
  background(COLORS.background);

  // 判斷測驗是否完成
  if (quizFinished) {
    // 繪製結果畫面
    drawResultScreen();

    // 結束本次繪圖
    return;
  }

  // 重新建立目前畫面的響應式版面
  rebuildLayout();

  // 繪製頁首
  drawHeader();

  // 儲存目前畫布狀態
  push();

  // 將內容依照捲動距離向上移動
  translate(0, -scrollY);

  // 繪製測驗內容
  drawQuizContent();

  // 恢復畫布狀態
  pop();

  // 繪製捲動提示
  drawScrollHint();
}

// 取得目前裝置的響應式尺寸設定
function getResponsiveMetrics() {
  // 取得目前畫面寬度
  const screenWidth = width;

  // 取得目前畫面高度
  const screenHeight = height;

  // 判斷目前是否為手機尺寸
  const isPhone = screenWidth < 600;

  // 判斷目前是否為平板尺寸
  const isTablet = screenWidth >= 600 && screenWidth < 1000;

  // 判斷目前是否為橫向畫面
  const isLandscape = screenWidth > screenHeight;

  // 設定畫面左右邊界
  let margin = constrain(screenWidth * 0.055, 18, 70);

  // 手機畫面使用較小左右邊界
  if (isPhone) {
    margin = constrain(screenWidth * 0.045, 14, 28);
  }

  // 平板畫面使用中等左右邊界
  if (isTablet) {
    margin = constrain(screenWidth * 0.06, 24, 48);
  }

  // 設定內容最大寬度
  const maxContentWidth = isPhone ? 680 : 980;

  // 計算實際內容寬度
  const contentWidth = min(screenWidth - margin * 2, maxContentWidth);

  // 設定標題大小
  const titleSize = isPhone
    ? constrain(screenWidth * 0.058, 23, 32)
    : constrain(screenWidth * 0.042, 28, 48);

  // 設定進度文字大小
  const progressSize = isPhone
    ? constrain(screenWidth * 0.035, 15, 20)
    : constrain(screenWidth * 0.022, 17, 25);

  // 設定題目文字大小
  const questionSize = isPhone
    ? constrain(screenWidth * 0.052, 19, 27)
    : constrain(screenWidth * 0.028, 22, 34);

  // 設定選項文字大小
  const optionSize = isPhone
    ? constrain(screenWidth * 0.045, 17, 24)
    : constrain(screenWidth * 0.023, 19, 28);

  // 設定解析文字大小
  const explanationSize = isPhone
    ? constrain(screenWidth * 0.038, 15, 20)
    : constrain(screenWidth * 0.018, 16, 23);

  // 設定一般間距
  const gap = isPhone ? 16 : 24;

  // 橫向手機降低部分間距
  if (isPhone && isLandscape) {
    return {
      margin,
      contentWidth,
      titleSize,
      progressSize,
      questionSize,
      optionSize,
      explanationSize,
      gap: 12,
      isPhone,
      isTablet,
      isLandscape
    };
  }

  // 回傳響應式尺寸設定
  return {
    margin,
    contentWidth,
    titleSize,
    progressSize,
    questionSize,
    optionSize,
    explanationSize,
    gap,
    isPhone,
    isTablet,
    isLandscape
  };
}

// 建立目前題目的動態版面
function rebuildLayout() {
  // 取得響應式尺寸資料
  const metrics = getResponsiveMetrics();

  // 取得目前題目資料
  const data = questions[currentQuestion];

  // 設定題目區塊起始位置
  const questionY = 132;

  // 設定題目內距
  const questionPadding = metrics.isPhone ? 18 : 26;

  // 取得題目換行文字
  const questionLines = wrapText(
    data.question,
    metrics.contentWidth - questionPadding * 2,
    metrics.questionSize
  );

  // 計算題目區塊高度
  const questionHeight = max(
    metrics.isPhone ? 84 : 108,
    questionLines.length * metrics.questionSize * 1.45 +
      questionPadding * 2
  );

  // 設定選項開始位置
  const optionsStartY = questionY + questionHeight + metrics.gap;

  // 設定選項內距
  const optionPadding = metrics.isPhone ? 16 : 22;

  // 設定選項最小高度
  const minimumOptionHeight = metrics.isPhone ? 68 : 78;

  // 設定選項間距
  const optionGap = metrics.isPhone ? 14 : 20;

  // 清空選項位置陣列
  optionBoxes = [];

  // 設定目前選項的起始位置
  let optionY = optionsStartY;

  // 逐一建立四個選項
  for (let i = 0; i < data.options.length; i++) {
    // 建立選項文字
    const optionText = `${String.fromCharCode(65 + i)}. ${data.options[i]}`;

    // 取得選項換行文字
    const optionLines = wrapText(
      optionText,
      metrics.contentWidth - optionPadding * 2,
      metrics.optionSize
    );

    // 計算選項高度
    const optionHeight = max(
      minimumOptionHeight,
      optionLines.length * metrics.optionSize * 1.45 +
        optionPadding * 2
    );

    // 儲存選項位置與文字資料
    optionBoxes.push({
      x: width / 2 - metrics.contentWidth / 2,
      y: optionY,
      w: metrics.contentWidth,
      h: optionHeight,
      lines: optionLines
    });

    // 計算下一個選項的位置
    optionY += optionHeight + optionGap;
  }

  // 取得最後一個選項
  const lastOption = optionBoxes[optionBoxes.length - 1];

  // 設定回饋區塊起始位置
  const feedbackY = lastOption.y + lastOption.h + metrics.gap;

  // 設定回饋區塊高度
  const feedbackHeight = hasAnswered
    ? max(150, metrics.isPhone ? 170 : 150)
    : 0;

  // 設定按鈕與回饋區塊之間的距離
  const buttonGap = metrics.isPhone ? 22 : 30;

  // 設定下一題按鈕寬度
  const buttonWidth = min(metrics.contentWidth, metrics.isPhone ? 260 : 300);

  // 設定下一題按鈕位置
  nextButton = {
    x: width / 2 - buttonWidth / 2,
    y: feedbackY + feedbackHeight + buttonGap,
    w: buttonWidth,
    h: metrics.isPhone ? 60 : 68
  };

  // 計算全部內容高度
  contentHeight = nextButton.y + nextButton.h + 40;

  // 限制捲動位置
  scrollY = constrain(scrollY, 0, max(0, contentHeight - height + 30));
}

// 繪製頁首
function drawHeader() {
  // 取得響應式尺寸
  const metrics = getResponsiveMetrics();

  // 設定標題文字大小
  textSize(metrics.titleSize);

  // 設定粗體字
  textStyle(BOLD);

  // 設定標題顏色
  fill(COLORS.title);

  // 繪製標題
  text("p5.js 程式設計指令測驗", width / 2, 34);

  // 設定進度文字大小
  textSize(metrics.progressSize);

  // 設定進度文字顏色
  fill(COLORS.text);

  // 顯示測驗進度
  text(
    `第 ${currentQuestion + 1} 題／共 ${questions.length} 題`,
    width / 2,
    84
  );

  // 設定分隔線顏色
  stroke("#bde0fe");

  // 設定分隔線粗細
  strokeWeight(3);

  // 繪製分隔線
  line(18, 108, width - 18, 108);

  // 移除線條
  noStroke();
}

// 繪製測驗內容
function drawQuizContent() {
  // 取得響應式尺寸
  const metrics = getResponsiveMetrics();

  // 取得目前題目
  const data = questions[currentQuestion];

  // 設定題目文字大小
  textSize(metrics.questionSize);

  // 設定題目背景顏色
  fill(COLORS.question);

  // 設定題目區塊高度
  const questionHeight = getQuestionHeight(data, metrics);

  // 繪製題目區塊
  roundedRect(
    width / 2 - metrics.contentWidth / 2,
    132,
    metrics.contentWidth,
    questionHeight,
    18
  );

  // 取得題目文字行
  const questionLines = wrapText(
    data.question,
    metrics.contentWidth - 52,
    metrics.questionSize
  );

  // 設定題目文字顏色
  fill(COLORS.text);

  // 設定題目文字大小
  textSize(metrics.questionSize);

  // 繪製題目文字
  drawLines(
    questionLines,
    width / 2,
    132 + questionHeight / 2,
    metrics.questionSize * 1.45
  );

  // 逐一繪製選項
  for (let i = 0; i < optionBoxes.length; i++) {
    // 取得目前選項資料
    const box = optionBoxes[i];

    // 設定選項背景顏色
    let optionColor = COLORS.option;

    // 判斷是否已完成作答
    if (hasAnswered) {
      // 判斷是否為正確答案
      if (i === data.answer) {
        // 正確答案使用淡藍色
        optionColor = COLORS.correct;
      }

      // 判斷是否為使用者選錯的答案
      if (i === selectedOption && i !== data.answer) {
        // 錯誤答案使用淡紅色
        optionColor = COLORS.wrong;
      }
    }

    // 設定上下跳動位置
    let jumpOffset = 0;

    // 判斷是否需要讓正確答案跳動
    if (
      hasAnswered &&
      selectedOption !== data.answer &&
      i === data.answer
    ) {
      // 使用 sin() 產生平滑動畫
      jumpOffset = sin(frameCount * 0.12) * 7;
    }

    // 設定選項背景顏色
    fill(optionColor);

    // 設定選項邊框顏色
    stroke(i === data.answer && hasAnswered ? COLORS.title : COLORS.border);

    // 設定邊框粗細
    strokeWeight(i === data.answer && hasAnswered ? 4 : 2);

    // 繪製選項背景
    roundedRect(box.x, box.y + jumpOffset, box.w, box.h, 18);

    // 移除邊框
    noStroke();

    // 設定選項文字顏色
    fill(COLORS.text);

    // 設定選項文字大小
    textSize(metrics.optionSize);

    // 繪製選項文字
    drawLines(
      box.lines,
      width / 2,
      box.y + box.h / 2 + jumpOffset,
      metrics.optionSize * 1.45
    );
  }

  // 判斷是否已完成作答
  if (hasAnswered) {
    // 取得最後一個選項
    const lastOption = optionBoxes[optionBoxes.length - 1];

    // 計算回饋區塊位置
    const feedbackY = lastOption.y + lastOption.h + metrics.gap;

    // 繪製回饋內容
    drawFeedback(feedbackY, metrics);

    // 繪製下一題按鈕
    drawNextButton(metrics);
  }
}

// 取得題目區塊高度
function getQuestionHeight(data, metrics) {
  // 取得題目換行文字
  const lines = wrapText(
    data.question,
    metrics.contentWidth - 52,
    metrics.questionSize
  );

  // 計算題目高度
  return max(
    metrics.isPhone ? 84 : 108,
    lines.length * metrics.questionSize * 1.45 + 52
  );
}

// 繪製答題回饋區塊
function drawFeedback(feedbackY, metrics) {
  // 取得目前題目資料
  const data = questions[currentQuestion];

  // 判斷是否答對
  const isCorrect = selectedOption === data.answer;

  // 設定回饋區塊寬度
  const feedbackWidth = metrics.contentWidth;

  // 設定回饋區塊高度
  const feedbackHeight = metrics.isPhone ? 170 : 150;

  // 設定回饋背景顏色
  fill(isCorrect ? COLORS.success : COLORS.error);

  // 繪製回饋區塊
  roundedRect(
    width / 2 - feedbackWidth / 2,
    feedbackY,
    feedbackWidth,
    feedbackHeight,
    18
  );

  // 設定結果文字大小
  textSize(metrics.isPhone ? 20 : 26);

  // 設定文字顏色
  fill(COLORS.text);

  // 設定結果文字
  const resultText = isCorrect
    ? "答對了！"
    : "答錯了！藍色跳動的選項是正確答案。";

  // 顯示答題結果
  text(resultText, width / 2, feedbackY + 32);

  // 設定解析文字大小
  textSize(metrics.explanationSize);

  // 取得解析換行文字
  const explanationLines = wrapText(
    data.explanation,
    feedbackWidth - 36,
    metrics.explanationSize
  );

  // 繪製解析文字
  drawLines(
    explanationLines,
    width / 2,
    feedbackY + 92,
    metrics.explanationSize * 1.45
  );
}

// 繪製下一題按鈕
function drawNextButton(metrics) {
  // 設定按鈕顏色
  fill(COLORS.button);

  // 繪製按鈕
  roundedRect(
    nextButton.x,
    nextButton.y,
    nextButton.w,
    nextButton.h,
    18
  );

  // 設定按鈕文字顏色
  fill(COLORS.buttonText);

  // 設定按鈕文字大小
  textSize(metrics.isPhone ? 20 : 25);

  // 設定按鈕文字
  const buttonText =
    currentQuestion === questions.length - 1
      ? "查看測驗結果"
      : "下一題";

  // 顯示按鈕文字
  text(
    buttonText,
    nextButton.x + nextButton.w / 2,
    nextButton.y + nextButton.h / 2
  );
}

// 繪製測驗結果
function drawResultScreen() {
  // 取得響應式尺寸
  const metrics = getResponsiveMetrics();

  // 設定標題文字大小
  textSize(metrics.isPhone ? 32 : 54);

  // 設定標題文字顏色
  fill(COLORS.title);

  // 顯示測驗完成
  text("測驗完成！", width / 2, height * 0.24);

  // 設定分數文字大小
  textSize(metrics.isPhone ? 58 : 90);

  // 設定分數文字顏色
  fill(COLORS.text);

  // 顯示答對題數
  text(`${correctCount}／${questions.length}`, width / 2, height * 0.43);

  // 設定說明文字大小
  textSize(metrics.isPhone ? 20 : 30);

  // 顯示說明文字
  text("答對題數", width / 2, height * 0.54);

  // 設定重新測驗按鈕寬度
  const buttonWidth = min(metrics.contentWidth, 300);

  // 設定重新測驗按鈕高度
  const buttonHeight = metrics.isPhone ? 60 : 70;

  // 設定重新測驗按鈕位置
  restartButton = {
    x: width / 2 - buttonWidth / 2,
    y: height * 0.67,
    w: buttonWidth,
    h: buttonHeight
  };

  // 設定按鈕背景顏色
  fill(COLORS.button);

  // 繪製重新測驗按鈕
  roundedRect(
    restartButton.x,
    restartButton.y,
    restartButton.w,
    restartButton.h,
    18
  );

  // 設定按鈕文字顏色
  fill(COLORS.buttonText);

  // 設定按鈕文字大小
  textSize(metrics.isPhone ? 21 : 27);

  // 顯示重新測驗文字
  text(
    "重新測驗",
    restartButton.x + restartButton.w / 2,
    restartButton.y + restartButton.h / 2
  );
}

// 處理滑鼠點擊
function mousePressed() {
  // 判斷是否在結果畫面
  if (quizFinished) {
    // 判斷是否點擊重新測驗
    if (isInside(mouseX, mouseY, restartButton)) {
      // 重設目前題目
      currentQuestion = 0;

      // 重設答對題數
      correctCount = 0;

      // 重設選項
      selectedOption = -1;

      // 重設作答狀態
      hasAnswered = false;

      // 重設測驗完成狀態
      quizFinished = false;

      // 重設捲動位置
      scrollY = 0;
    }

    // 結束滑鼠事件
    return false;
  }

  // 計算捲動後的實際點擊位置
  const adjustedY = mouseY + scrollY;

  // 判斷目前是否尚未作答
  if (!hasAnswered) {
    // 檢查所有選項
    for (let i = 0; i < optionBoxes.length; i++) {
      // 取得目前選項
      const box = optionBoxes[i];

      // 設定正確答案跳動的實際位置
      const animatedBox = {
        x: box.x,
        y: box.y,
        w: box.w,
        h: box.h
      };

      // 判斷是否點擊選項
      if (isInside(mouseX, adjustedY, animatedBox)) {
        // 記錄使用者選取的答案
        selectedOption = i;

        // 設定已經作答
        hasAnswered = true;

        // 判斷是否答對
        if (i === questions[currentQuestion].answer) {
          // 答對題數加一
          correctCount++;
        }

        // 結束檢查選項
        break;
      }
    }

    // 結束尚未作答處理
    return false;
  }

  // 判斷是否點擊下一題按鈕
  if (isInside(mouseX, adjustedY, nextButton)) {
    // 判斷是否是最後一題
    if (currentQuestion === questions.length - 1) {
      // 設定測驗完成
      quizFinished = true;
    } else {
      // 前往下一題
      currentQuestion++;

      // 清除選項選取狀態
      selectedOption = -1;

      // 設定尚未作答
      hasAnswered = false;

      // 將畫面捲動回最上方
      scrollY = 0;
    }
  }

  // 阻止瀏覽器預設行為
  return false;
}

// 處理觸控開始
function touchStarted() {
  // 判斷是否有觸控點
  if (touches.length > 0) {
    // 記錄觸控起點
    touchStartY = touches[0].y;

    // 記錄開始觸控時的捲動位置
    touchStartScrollY = scrollY;

    // 設定正在觸控
    isTouching = true;
  }

  // 阻止瀏覽器預設行為
  return false;
}

// 處理觸控移動
function touchMoved() {
  // 判斷是否正在觸控
  if (isTouching && touches.length > 0) {
    // 計算觸控移動距離
    const moveDistance = touchStartY - touches[0].y;

    // 更新捲動位置
    scrollY = touchStartScrollY + moveDistance;

    // 限制捲動範圍
    scrollY = constrain(scrollY, 0, max(0, contentHeight - height + 30));
  }

  // 阻止瀏覽器預設行為
  return false;
}

// 處理觸控結束
function touchEnded() {
  // 設定觸控狀態結束
  isTouching = false;

  // 阻止瀏覽器預設行為
  return false;
}

// 處理滑鼠滾輪
function mouseWheel(event) {
  // 計算最大捲動距離
  const maxScroll = max(0, contentHeight - height + 30);

  // 更新捲動位置
  scrollY += event.delta;

  // 限制捲動距離
  scrollY = constrain(scrollY, 0, maxScroll);

  // 阻止瀏覽器預設行為
  return false;
}

// 判斷座標是否位於指定區塊
function isInside(px, py, box) {
  // 回傳座標是否在矩形範圍內
  return (
    px >= box.x &&
    px <= box.x + box.w &&
    py >= box.y &&
    py <= box.y + box.h
  );
}

// 取得中文逐字換行文字
function wrapText(message, maxWidth, fontSize) {
  // 設定目前文字大小
  textSize(fontSize);

  // 將文字轉成逐字陣列
  const characters = Array.from(message);

  // 建立文字行陣列
  const lines = [];

  // 設定目前文字行
  let currentLine = "";

  // 逐字處理
  for (let i = 0; i < characters.length; i++) {
    // 取得目前字元
    const character = characters[i];

    // 建立測試文字
    const testLine = currentLine + character;

    // 判斷是否超過最大寬度
    if (textWidth(testLine) > maxWidth && currentLine.length > 0) {
      // 儲存目前文字行
      lines.push(currentLine);

      // 將目前字元放到下一行
      currentLine = character;
    } else {
      // 將測試文字設定為目前文字行
      currentLine = testLine;
    }
  }

  // 儲存最後一行文字
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  // 回傳文字行
  return lines;
}

// 逐行繪製文字
function drawLines(lines, centerX, centerY, lineHeight) {
  // 計算全部文字的高度
  const totalHeight = lines.length * lineHeight;

  // 計算第一行文字位置
  const firstLineY = centerY - totalHeight / 2 + lineHeight / 2;

  // 逐行繪製
  for (let i = 0; i < lines.length; i++) {
    // 計算目前文字行位置
    const lineY = firstLineY + i * lineHeight;

    // 繪製文字
    text(lines[i], centerX, lineY);
  }
}

// 重新建立圓角矩形
function roundedRect(x, y, w, h, radius) {
  // 繪製圓角矩形
  rect(x, y, w, h, radius);
}

// 顯示捲動提示
function drawScrollHint() {
  // 判斷內容是否超出畫布
  if (contentHeight > height) {
    // 設定提示文字大小
    textSize(15);

    // 設定提示文字顏色
    fill(COLORS.title);

    // 顯示捲動提示
    text("請上下滑動或使用滑鼠滾輪瀏覽", width / 2, height - 16);
  }
}

// 當視窗大小改變時執行
function windowResized() {
  // 重新調整畫布大小
  resizeCanvas(windowWidth, windowHeight);

  // 將捲動位置限制在合理範圍
  scrollY = constrain(scrollY, 0, max(0, contentHeight - height + 30));

  // 重新建立響應式版面
  rebuildLayout();
}