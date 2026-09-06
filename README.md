# LID Suffix Switcher

Figma에서 선택한 영역의 **텍스트 레이어 이름(LID) 서픽스를 `_h`, `_k`, `_g` 중 원하는 값으로 일괄 변경하는 Plugin**입니다.

화면에 표시되는 실제 텍스트와 디자인은 변경하지 않고,  
**Layers 패널의 Text Layer 이름만 변경**합니다.

---

## Overview

현대 / 기아 / 제네시스 등 브랜드별 화면을 관리할 때 동일한 LID 구조를 사용하면서 브랜드에 따라 서로 다른 서픽스를 사용하는 경우가 있습니다.

예를 들어 다음과 같이 기아용 LID가 입력된 화면이 있다고 가정합니다.

```text
cci_msg_service_completed_k
cci_ctn_write_review_k
cci_ctn_view_photo_k
cci_ctn_payment_history_k
```

해당 화면 또는 Component를 선택하고 `_h`로 변경하면:

```text
cci_msg_service_completed_h
cci_ctn_write_review_h
cci_ctn_view_photo_h
cci_ctn_payment_history_h
```

와 같이 선택한 영역 내부의 LID 서픽스가 일괄 변경됩니다.

> 화면에 표시되는 실제 텍스트는 변경되지 않습니다.

---

## Suffix

Plugin에서 지원하는 서픽스는 다음과 같습니다.

| Suffix | Brand |
| --- | --- |
| `_h` | Hyundai |
| `_k` | Kia |
| `_g` | Genesis |

현재 어떤 서픽스가 적용되어 있는지는 관계없이 원하는 서픽스로 변경할 수 있습니다.

예를 들어 `_h`로 변경하면:

```text
cci_msg_service_completed_k
→ cci_msg_service_completed_h

cci_ctn_write_review_g
→ cci_ctn_write_review_h

cci_ctn_view_photo_h
→ 변경 없음
```

---

## Features

- 선택한 영역 내부의 Text Layer 자동 탐색
- `_h`, `_k`, `_g` 서픽스 자동 인식
- 원하는 브랜드 서픽스로 일괄 변경
- Frame 단위 실행 지원
- Component 단위 실행 지원
- Group / Instance 내부 Text Layer 탐색
- 개별 Text Layer 선택 지원
- 여러 개의 Layer 동시 선택 지원
- 숨겨진 Text Layer 제외 옵션
- 이미 동일한 서픽스가 적용된 Layer 자동 제외
- 지원하는 서픽스가 없는 Layer 자동 제외
- 변경된 Layer 개수 확인
- 변경 전 / 후 LID 예시 확인

---

## How to Use

### 1. 변경할 영역 선택

Figma에서 서픽스를 변경하려는 영역을 선택합니다.

전체 화면을 변경하려면 **Frame 전체**를 선택할 수 있습니다.

```text
Screen Frame
├─ Component
├─ Component
├─ Text
├─ Group
└─ ...
```

특정 영역만 변경하려면 **Component 또는 Group만 선택**할 수도 있습니다.

```text
Component
├─ cci_msg_service_completed_k
├─ cci_ctn_write_review_k
└─ cci_ctn_view_photo_k
```

개별 Text Layer 또는 여러 Text Layer를 직접 선택하는 것도 가능합니다.

---

### 2. Plugin 실행

Figma에서 `LID Suffix Switcher`를 실행합니다.

---

### 3. 변경할 Suffix 선택

다음 세 가지 중 원하는 서픽스를 선택합니다.

```text
_h    _k    _g
```

예를 들어 기아 화면을 현대 화면용 LID로 변경하려면:

```text
_h
```

를 선택합니다.

---

### 4. 일괄 변경

`서픽스 일괄 변경` 버튼을 클릭합니다.

선택한 영역 내부의 Text Layer를 탐색하여 `_h`, `_k`, `_g`로 끝나는 Layer Name을 찾아 선택한 서픽스로 변경합니다.

---

## Example

### Before

기아 화면의 Layer가 다음과 같이 구성되어 있다고 가정합니다.

```text
신청상세 Frame
│
├─ cci_msg_service_completed_k
├─ -
├─ cci_ctn_write_review_k
├─ Rectangle 1256
├─ cci_ctn_view_photo_k
├─ Line 76
├─ Line 84
└─ cci_ctn_payment_history_k
```

Plugin에서 `_h`를 선택하고 실행합니다.

### After

```text
신청상세 Frame
│
├─ cci_msg_service_completed_h
├─ -
├─ cci_ctn_write_review_h
├─ Rectangle 1256
├─ cci_ctn_view_photo_h
├─ Line 76
├─ Line 84
└─ cci_ctn_payment_history_h
```

`Rectangle`, `Line` 등의 일반 Layer는 변경하지 않습니다.

또한 `-`처럼 `_h`, `_k`, `_g`로 끝나지 않는 Text Layer Name 역시 변경하지 않습니다.

---

## Matching Rule

LID Suffix Switcher는 Layer Name의 **가장 마지막 서픽스만 검사**합니다.

다음 정규식을 사용합니다.

```javascript
/_(h|k|g)$/
```

따라서 다음 Layer는 변경 대상입니다.

```text
cci_msg_service_completed_k
cci_ctn_write_review_h
cci_ctn_view_photo_g
```

반면 다음 Layer는 변경하지 않습니다.

```text
-
예약고객
Rectangle 1256
Group 123
cci_ctn_example
```

문자열 중간에 `_h`, `_k`, `_g`가 존재하더라도 마지막 서픽스가 아니라면 변경하지 않습니다.

---

## How It Works

Plugin은 Figma의 실제 화면 텍스트 값인:

```javascript
textNode.characters
```

를 수정하지 않습니다.

Layers 패널에서 사용하는 Layer Name인:

```javascript
textNode.name
```

만 변경합니다.

핵심 로직은 다음과 같습니다.

```javascript
const suffixPattern = /_(h|k|g)$/;

const newName = textNode.name.replace(
  suffixPattern,
  `_${targetSuffix}`
);

textNode.name = newName;
```

따라서 화면에 표시되는 텍스트와 디자인에는 영향을 주지 않습니다.

---

## Screen Text Safety

예를 들어 Figma 화면에 다음 문구가 표시되고 있다고 가정합니다.

```text
서비스가 완료되었습니다
```

Layer Name은 다음과 같습니다.

```text
cci_msg_service_completed_k
```

`_h`로 변경한 후에는:

```text
화면 표시

서비스가 완료되었습니다
```

```text
Layer Name

cci_msg_service_completed_h
```

가 됩니다.

즉 화면의 실제 문구는 그대로 유지됩니다.

---

## Selection Scope

Plugin은 현재 선택한 영역을 기준으로 동작합니다.

### 전체 Frame 선택

Frame 내부의 모든 Text Layer를 탐색합니다.

```text
Frame
└─ 모든 하위 Text Layer
```

### Component 선택

해당 Component 내부의 Text Layer만 탐색합니다.

```text
Component
└─ 해당 Component 내부 Text Layer
```

### Group 선택

해당 Group 내부의 Text Layer만 탐색합니다.

```text
Group
└─ 해당 Group 내부 Text Layer
```

### Text Layer 선택

선택한 Text Layer만 변경합니다.

```text
Text Layer
```

따라서 필요한 범위만 선택하여 서픽스를 변경할 수 있습니다.

---

## Result

실행 후 변경 결과를 확인할 수 있습니다.

예:

```text
_h 변경 완료 · 24개 변경
```

상세 결과에서는 다음 정보를 확인할 수 있습니다.

```text
전체 Text Layer: 31개
변경: 24개
이미 동일: 3개
지원 서픽스 없음: 4개
```

일부 변경 내역도 표시됩니다.

```text
cci_msg_service_completed_k
→ cci_msg_service_completed_h

cci_ctn_write_review_k
→ cci_ctn_write_review_h

cci_ctn_view_photo_k
→ cci_ctn_view_photo_h
```

---

## Hidden Layer

필요한 경우:

```text
숨겨진 텍스트 레이어 제외
```

옵션을 활성화할 수 있습니다.

활성화하면 Figma에서 `visible = false` 상태인 Text Layer는 서픽스 변경 대상에서 제외됩니다.

---

## Project Structure

```text
lid-suffix-switcher/
├─ manifest.json
├─ code.js
├─ ui.html
└─ README.md
```

### `manifest.json`

Figma Plugin의 기본 설정을 관리합니다.

### `code.js`

Plugin의 핵심 로직을 담당합니다.

- 선택 영역 확인
- Text Layer 탐색
- 기존 서픽스 확인
- `_h`, `_k`, `_g` 변환
- 변경 결과 집계

### `ui.html`

Plugin의 사용자 인터페이스를 담당합니다.

- `_h` / `_k` / `_g` 선택
- 숨겨진 Layer 제외 옵션
- 실행 버튼
- 변경 결과 표시

---

## Installation

1. Plugin 프로젝트 폴더를 준비합니다.
2. 다음 파일을 동일한 폴더에 저장합니다.

```text
manifest.json
code.js
ui.html
README.md
```

3. Figma Desktop을 실행합니다.
4. `Plugins → Development → Import plugin from manifest...`로 이동합니다.
5. 프로젝트의 `manifest.json`을 선택합니다.
6. Development Plugin에서 `LID Suffix Switcher`를 실행합니다.

---

## Notes

LID Suffix Switcher는 **Layer Name만 변경**하는 Plugin입니다.

다음 항목에는 영향을 주지 않습니다.

- 실제 화면 Text
- Font
- Font Size
- Text Style
- Position
- Auto Layout
- Frame
- Component
- Group
- Rectangle
- Line
- 화면 디자인

또한 Layer Name이 `_h`, `_k`, `_g` 중 하나로 끝나는 경우에만 변경하기 때문에 일반적인 Layer Name은 그대로 유지됩니다.

잘못 변경한 경우 Figma의 `Ctrl + Z` 또는 `Cmd + Z`를 통해 되돌릴 수 있습니다.
