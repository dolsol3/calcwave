// ./app/write/page.tsx

'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import Title from '../../components/write/Title';
import { Button, Card, CardBody } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";

const WritePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtag, setHashtag] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handlePublish = async () => {
    if (!user) {
      alert("Log in is required.");
      return;
    }

    if (!title || !description || !hashtag) {
      onOpen();
      return;
    }

    const docData = {
      uid: user.uid,
      userName: user.displayName,
      userPicture: user.photoURL,
      title,
      description,
      hashtag,
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
        router.push(`/detail/${responseData.userId}/${responseData.slug}`);
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error("An error occurred during the publication of the article:", error);
      alert('The publication of the article failed.');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1 className="text-4xl font-bold text-center mb-8 text-[#2E8B57] font-['Roboto Rounded']">계산기 작성</h1>
      <Card className="max-w-4xl w-full shadow-md rounded-lg bg-white mx-auto">
        <CardBody className="p-8 flex flex-col items-center">
          <Title setTitle={setTitle} setDescription={setDescription} setHashtag={setHashtag} />
          <Button 
            onClick={handlePublish} 
            className="mt-6 button-primary w-full"
          >
            Publishing Articles
          </Button>
        </CardBody>
      </Card>
      
      <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Missing input</ModalHeader>
          <ModalBody>
            <p>Please enter everything.</p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default WritePage;
