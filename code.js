figma.showUI(__html__, {
  width: 360,
  height: 360,
  themeColors: true
});

/**
 * 선택한 노드와 그 하위에서
 * TEXT 레이어를 모두 수집
 */
function collectTextNodes(selection) {
  let textNodes = [];

  for (const node of selection) {
    // 선택 자체가 TEXT인 경우
    if (node.type === "TEXT") {
      textNodes.push(node);
    }

    // Frame / Component / Group / Instance 등
    // 하위 TEXT 레이어 탐색
    if ("findAll" in node) {
      const children = node.findAll(
        (child) => child.type === "TEXT"
      );

      textNodes.push(...children);
    }
  }

  // 중복 제거
  return [...new Set(textNodes)];
}


/**
 * 레이어 이름 끝의
 * _h / _k / _g 를 원하는 suffix로 변경
 */
function replaceSuffix(layerName, targetSuffix) {
  if (!layerName) {
    return null;
  }

  /**
   * 반드시 문자열 끝에 있는
   * _h / _k / _g 만 변경
   *
   * 예:
   * cci_msg_test_k
   * → cci_msg_test_h
   *
   * 중간에 있는 _k 등은 영향 없음
   */
  const suffixPattern = /_(h|k|g)$/;

  if (!suffixPattern.test(layerName)) {
    return null;
  }

  return layerName.replace(
    suffixPattern,
    `_${targetSuffix}`
  );
}


figma.ui.onmessage = async (msg) => {

  /**
   * 종료
   */
  if (msg.type === "close") {
    figma.closePlugin();
    return;
  }


  /**
   * 실행
   */
  if (msg.type !== "replace-suffix") {
    return;
  }


  const selection =
    figma.currentPage.selection;


  /**
   * 아무것도 선택되지 않은 경우
   */
  if (selection.length === 0) {

    figma.ui.postMessage({
      type: "result",
      status: "error",
      message: "Frame, Component 또는 Layer를 선택해주세요."
    });

    return;
  }


  const targetSuffix =
    msg.targetSuffix;


  /**
   * 지원하지 않는 suffix 방어
   */
  if (
    !["h", "k", "g"].includes(
      targetSuffix
    )
  ) {

    figma.ui.postMessage({
      type: "result",
      status: "error",
      message: "변경할 서픽스를 선택해주세요."
    });

    return;
  }


  /**
   * TEXT 레이어 수집
   */
  const textNodes =
    collectTextNodes(selection);


  if (textNodes.length === 0) {

    figma.ui.postMessage({
      type: "result",
      status: "error",
      message: "선택한 영역에 텍스트 레이어가 없습니다."
    });

    return;
  }


  let changedCount = 0;
  let alreadySameCount = 0;
  let noSuffixCount = 0;
  let skippedHiddenCount = 0;
  let failedCount = 0;


  const examples = [];


  for (const textNode of textNodes) {

    try {

      /**
       * 숨겨진 레이어 제외 옵션
       */
      if (
        msg.excludeHidden &&
        !textNode.visible
      ) {

        skippedHiddenCount++;
        continue;
      }


      const oldName =
        textNode.name;


      /**
       * 지원하는 suffix가 없는 레이어
       */
      const newName =
        replaceSuffix(
          oldName,
          targetSuffix
        );


      if (!newName) {

        noSuffixCount++;
        continue;
      }


      /**
       * 이미 원하는 suffix인 경우
       */
      if (
        oldName === newName
      ) {

        alreadySameCount++;
        continue;
      }


      /**
       * ★ 핵심
       *
       * 실제 화면 텍스트는 건드리지 않음
       *
       * textNode.characters는 그대로
       * textNode.name만 변경
       */
      textNode.name =
        newName;


      changedCount++;


      /**
       * UI에 보여줄 변경 예시
       */
      if (
        examples.length < 5
      ) {

        examples.push(
          `${oldName} → ${newName}`
        );

      }

    }

    catch (error) {

      console.error(
        "Suffix 변경 실패:",
        textNode.name,
        error
      );

      failedCount++;

    }
  }


  /**
   * 결과 전달
   */
  figma.ui.postMessage({

    type: "result",

    status:
      failedCount > 0
        ? "warning"
        : "success",

    counts: {
      total:
        textNodes.length,

      changed:
        changedCount,

      alreadySame:
        alreadySameCount,

      noSuffix:
        noSuffixCount,

      hidden:
        skippedHiddenCount,

      failed:
        failedCount
    },

    examples,

    message:
      `_${targetSuffix} 변경 완료 · ` +
      `${changedCount}개 변경`

  });

};
