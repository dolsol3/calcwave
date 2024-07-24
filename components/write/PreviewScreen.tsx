// ./components/write/PreviewScreen.tsx

'use client'
import React, { useEffect, useState } from 'react';
import { useCalculation } from './useCalculationState';
import InputField from './InputField';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { CalcElement } from './types';
import ExpressionDisplay from './ExpressionDisplay';
import { auth } from '../../firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface PreviewScreenProps {
  title: string;
  description: string;
  hashtag: string;
}

const PreviewScreen: React.FC<PreviewScreenProps> = ({ title, description, hashtag }) => {
  const { elements, customInputs, calculate, calculationResult, resetCalculator, saveExpression, prefixTexts, suffixTexts, updatePrefixText, updateSuffixText, updateElement } = useCalculation();
  const [leftUnit, setLeftUnit] = useState(''); // 계산 결과 앞의 단위
  const [rightUnit, setRightUnit] = useState(''); // 계산 결과 뒤의 단위
  const [user, setUser] = useState<User | null>(null); // User 타입을 허용하도록 설정
  const [modalOpen, setModalOpen] = useState(false); // 모달 상태 추가
  const [newDocId, setNewDocId] = useState(''); // 새 문서 ID 저장
  const router = useRouter();

  useEffect(() => {
    console.log("Updated calculation result:", calculationResult);
  }, [calculationResult, customInputs]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });

    return () => unsubscribe();
  }, []);

  const handlePublish = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const inputVariables = elements.filter(el => el.type === 'input').map((element: CalcElement) => ({
      입력변수아이디: element.id,
      변수단위이름: prefixTexts[element.id] || '',
      변수단위: suffixTexts[element.id] || '',
    }));

    const docData = {
      uid: user.uid,
      userName: user.displayName,
      userPicture: user.photoURL,
      title,
      description,
      hashtag,
      elements,
      customInputs,
      leftUnit,
      rightUnit,
      calculationResult,
      prefixTexts,
      suffixTexts,
      inputVariables
    };

    try {
      const response = await fetch('https://publish-hry6fdb6aa-du.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify(docData),
      });

      if (response.ok) {
        const responseData = await response.json();
        setNewDocId(responseData.id);
        setModalOpen(true); // 모달 열기
        resetCalculator();
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error("계산기 발행 중 오류가 발생했습니다:", error);
      alert('계산기 발행에 실패했습니다.');
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    router.push(`/detail/${newDocId}`); // 새 문서 페이지로 이동
  };

  return (
    <div className="preview-screen">
      <ExpressionDisplay />
      <div className="inputs-display">
        {elements.filter(el => el.type === 'input').map((element: CalcElement) => (
          <InputField
            key={element.id}
            label={element.inputLabel || "Custom Input"}
            placeholder="Enter value"
            value={customInputs[element.id]?.toString() || ''}
            onChange={(e) => {
              const newValue = e.target.value;
              updateElement(element.id, newValue); // updateElement 추가
              console.log(`Input for ${element.id} changed to:`, newValue);
            }}
            prefixText={prefixTexts[element.id] || ''}
            suffixText={suffixTexts[element.id] || ''}
            onPrefixChange={(e) => updatePrefixText(element.id, e.target.value)}
            onSuffixChange={(e) => updateSuffixText(element.id, e.target.value)}
          />
        ))}
      </div>

      <div className="unit-inputs my-2">
        <input
          type="text"
          placeholder="계산결과 이름을 적어주세요"
          value={leftUnit}
          onChange={(e) => setLeftUnit(e.target.value)}
          className="border p-2"
        />
        <span className="result-display">{leftUnit} {calculationResult} {rightUnit}</span>
        <input
          type="text"
          placeholder="수의 단위를 적어주세요"
          value={rightUnit}
          onChange={(e) => setRightUnit(e.target.value)}
          className="border p-2"
        />
      </div>
      <Button onPress={resetCalculator}>초기화</Button>
      <Button onPress={saveExpression}>수식 저장하기</Button>
      <Button onPress={calculate}>계산하기</Button>
      <Button onPress={handlePublish}>계산기 발행하기</Button>

      <Modal isOpen={modalOpen} onClose={handleModalClose}>
        <ModalContent>
          <ModalHeader>
            <h2>계산기 발행 완료</h2>
          </ModalHeader>
          <ModalBody>
            <p>계산기가 성공적으로 발행되었습니다.</p>
          </ModalBody>
          <ModalFooter>
            <Button onPress={handleModalClose}>
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PreviewScreen;
