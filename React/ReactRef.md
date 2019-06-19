# React Ref



### React Ref 를 왜 사용할까?

Dom element 혹은 Component instance 에 직접 적으로 접근해야할 때 사용한다.

직접 접근할때 사용하는 예시는 다음과 같다.

1. input 등 포커스 이벤트등 DOM Element에 이벤트를 줄 때
2. DOM Element 를 가지고 와야할 때
   1. querySelector, getElementById 등으로 하면 비효율적이고 관리 포인트가 늘어나기 때문에 Ref 를 사용하면 좋을 것 같다.
3. 특정 DOM에 위치를 알고 싶을 때



### React Ref 를 어떻게 사용할까?

리액트에는 React.createRef 라는 함수가 있다.

이 함수는 React Ref 타입을 생성 하는 역할을 한다.

아래와 같이 Dome Element나 Component instance에 Ref를 생성된 Ref에 할당 할 수 있다.

```
import React from 'react';

class Test extends React.Component {
	public divRef = React.createRef<HTMLDIVElement>();

	public render() {
		return (
			<div ref={this.divRef}>
				dome
			</div>
		)
	}
}
```



사실 예전에는 아래와 같은 방법을 사용했지만 위에 방법이 최신이다! 

( 타입스크립트면 및에 코드는 에러 발생함 해당 ref 타입은 div이고 divRef 은 React.ObjectRef<DivElement> 이기 때문에 )

```
public render() {
	return (
		<div ref={(ref) => this.divRef = ref }>
			dome
		</div>
	)
}
```



### 부모 컴포넌트가 자식 컴포넌트에 Ref가 필요로 할 때

> 만약, 자식 컴포넌트가 부모 컴포넌트에 Ref가 필요로 하다면 그건 설계를 잘못한 것 일 수도 있다.

React에서는 ref 를 넘겨줄 때 props 처럼 넘겨줄 수 있다. 

하지만 만약 ref 라는 이름으로 넘겨줄 때 자식 컴포넌트에 ref 이름의 props를 볼 수 없을 것 이다!

왜냐하면, ref 는 리액트에 key와 같은 속성이기 때문이다!

자식 컴포넌트에 ref 라는 이름으로 넘겨줄 일이 필요하다면

리액트에서 제공하는 React.forwardRef 를 사용하면 된다.



React.forwardRef는 아래와 같이 자식 컴포넌트에서 사용한다면 상위에서 ref 라는 이름으로 넘겨줘도 문제없다!



단 forwardRef 함수에 두 번째 인자인 ref 는 props가 절대 아니다!

```
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// You can now get a ref directly to the DOM button:
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```



### 회사에서 어떻게 ref와 forwardRef를 사용했나?

intersectionObserver로 target dom에 위치 했을 때 숫자가 카운팅 되면서 올라가는 기능을 구현해야 했다.



참고로 intersectionObserver는 아래와 같이 target dom element를 intersectionObserver가 알수 있게 등록을 해줘야 한다.

```
const options = {
  root: null,
  rootMargin: '0px',
  threshold: 1.0
}

const observer = new IntersectionObserver(() => {
	// 해당 dom element에 위치 했을 때 Observer가 할 행동을 정의
}, options);

const targetDomElement = document.querySelector('#test');

observer.target(targetDomElement);
```

하지만 document.querySelector 를 사용안하고 해결할 수 있다는 리뷰를 받았다.

어떻게 할지 고민하다가 React에 Ref로 할 수 있다는 것을 알게 되었다.



또한 intersectionObserver 행동에서 dom element가 viewport 영역일때 숫자 카운팅을 해줘야 하는 상황 이었다.



숫자를 카운팅해주는 컴포넌트는 하위 컴포넌트들이 었기 때문에 observer에서 행동을 정의해 주려면 하위 컴포넌트에 ref를 상위 컴포넌트가 알아야 되는 상황이 었다.



그렇기 때문에 아래와 같이 해결을 했다.

```
import React from 'react';

class ParentComponent extends React.Component {
	public childRef = React.createRef<any>();

	public render() {
		return (
			<div ref={getParenetComponentRef}>
				<ChildComponent ref={childRef} />
			</div>
		)
	}
	
	public getParentComponentRef = (ref) => {
		const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0
    }

    const observer = new IntersectionObserver(() => {
			childRef.restart(); // 카운팅 애니메이션 스타트!
    }, options);

    observer.target(ref);
	}
}

const ChildComponent = React.forwardRef((props, ref) => (
	<CountUp {...필요한 props} ref={ref} />
));

```

일단은 이런 패턴으로 사용했다.



### 결론

처럼 외부라이브러리에 API를 사용하고 싶은 분이 계신다면 Ref를 사용하는것을 추천한다!

또한 개인 프로젝트든 회사 프로젝트든 Ref 를 사용하게 되는 경우가 있어서 개선하게 되었다면 해당 문서를 업데이트 하겠다!