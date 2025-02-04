
import React, { useState } from 'react'; // ReactとuseStateをインポート
import { useRouter } from 'next/router'; // useRouterをインポート（Next.jsのルーティング機能を利用）
import styles from '../../../styles/openCampusesAdd.module.css'; // スタイルシートをインポート
import { collection, addDoc, Timestamp, doc, setDoc, getDocs, query, where, increment, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase'; // Firebaseの設定をインポート
import * as XLSX from 'xlsx'; // Excelファイルを読み込むためのライブラリをインポート


import Header from "../../../components/admin/OpenCampus/Header";
import Table from "../../../components/admin/OpenCampus/Table";
import ImportArea from "../../../components/admin/OpenCampus/ImportArea";
import CountArea from "../../../components/admin/OpenCampus/CountArea";
import RegisterButton from "../../../components/admin/OpenCampus/RegisterButton";

// 参加者用のデータ型を定義
type Member = {
  名前: string;
  フリガナ: string;
  性別: string;
  高校名: string;
  学年: string;
  参加学科: string;
  参加回数: string;
};

// スタッフ用データ型を定義
type Staff = {
  学科名: string;
  名前: string;
  フリガナ: string;
  学年: string;
  性別: string;
  役割: string; // 使われていないが、型定義には残しておく
};

const OpenCampusesAdd: React.FC = () => {
  const [title, setTitle] = useState(''); // タイトルの状態を管理するステート
  const [memo, setMemo] = useState(''); // メモの状態を管理するステート
  const [isLoading, setIsLoading] = useState(false); // ローディング状態を管理するステート
  const [error, setError] = useState<string | null>(null); // エラーメッセージの状態を管理するステート
  const [importedData, setImportedData] = useState<Member[]>([]); // インポートされた参加者データを格納するステート
  const [staffData, setStaffData] = useState<Staff[]>([]); // インポートされたスタッフデータを格納するステート
  const [date, setDate] = useState(''); // 開催日を管理するステート
  const router = useRouter(); // Next.jsのルーターを取得

  // 表示するデータの種類（'participants' or 'staffs'）を管理するステート。初期値は'participants'
  const [displayData, setDisplayData] = useState<'participants' | 'staffs'>('participants');

  // タイトルの入力が変更されたときに呼び出される関数
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value); // 入力されたタイトルをステートに設定
  };

  // メモの入力が変更されたときに呼び出される関数
  const handleMemoChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMemo(event.target.value); // 入力されたメモをステートに設定
  };

  // 日付の入力が変更されたときに呼び出される関数
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value); // 入力された日付をステートに設定
  };

  // ファイルがインポートされたときに呼び出される関数
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 選択されたファイルを取得。filesがnullの場合はnullを代入
    const file = event.target.files ? event.target.files[0] : null;
    // ファイルが選択されていない場合はアラートを表示して終了
    if (!file) {
      alert("ファイルを選択してください");
      return;
    }

    const reader = new FileReader(); // FileReaderオブジェクトを作成
    // ファイルの読み込みが完了したときに呼び出される関数
    reader.onload = async (event) => {
      // 読み込んだデータを取得。resultがnullの場合はreturn
      const data = event.target?.result;
      if (!data) return;

      // データをバイナリ形式で読み込む
      const workbook = XLSX.read(data, { type: 'binary' });

      // 参加者データ (Sheet1) を取得
      const participantsSheetName = workbook.SheetNames[0];
      const participantsSheet = workbook.Sheets[participantsSheetName];
      const members: Member[] = XLSX.utils.sheet_to_json(participantsSheet);
      setImportedData(members); // 取得した参加者データをステートに設定

      // スタッフデータ (Sheet2) を取得
      const staffsSheetName = workbook.SheetNames[1];
      const staffsSheet = workbook.Sheets[staffsSheetName];
      const staffs: Staff[] = XLSX.utils.sheet_to_json(staffsSheet);
      setStaffData(staffs); // 取得したスタッフデータをステートに設定

      setDisplayData('participants'); // インポートしたら参加者を表示するようステートを更新
    };

    // ファイルの読み込みに失敗したときに呼び出される関数
    reader.onerror = (error) => {
      console.error("Error reading file: ", error);
      setError('ファイルの読み込みに失敗しました');
    };

    reader.readAsBinaryString(file); // ファイルをバイナリ文字列として読み込む
  };

  // 登録ボタンがクリックされたときに呼び出される関数
  const handleRegister = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      // OpenCampus ドキュメントの登録
      const docRef = await addDoc(collection(db, "openCampuses"), {
        title: title,
        memo: memo,
        date: date
          ? Timestamp.fromDate(new Date(date))
          : Timestamp.fromDate(new Date("2024-08-10")),
        participantsCount: importedData.length,
        staffCount: staffData.length,
      });
      const openCampusId = docRef.id;
  
      // 参加者データの登録
      const participantsCollectionRef = collection(docRef, "participants");
      for (const member of importedData) {
        // 名前、高校名、参加学科で参加者を検索
        const participantsQuery = query(
          collection(db, "participants"),
          where("name", "==", member.名前),
          where("school", "==", member.高校名),
        );
        const participantsSnapshot = await getDocs(participantsQuery);
  
        if (!participantsSnapshot.empty) {
          // 既存の参加者が見つかった場合
          const participantDoc = participantsSnapshot.docs[0];
          const participantId = participantDoc.id;
  
          // 1. 参加回数をインクリメント
          await updateDoc(doc(db, "participants", participantId), {
            count: increment(1),
          });
  
          // 2. pastEvents サブコレクションに新しいイベントを追加
          const pastEventsCollectionRef = collection(
            db,
            "participants",
            participantId,
            "pastEvents"
          );
          await addDoc(pastEventsCollectionRef, {
            openCampusId: openCampusId,
            date: date
              ? Timestamp.fromDate(new Date(date))
              : Timestamp.fromDate(new Date("2024-08-10")),
            grade: member.学年,
            subject: member.参加学科,
            count: increment(1),
            memo: "",
          });
  
          console.log(
            `Participant ${member.名前} updated in collection 'participants'.`
          );
  
          // 3. openCampusesのparticipantsサブコレクションに追加
          await addDoc(participantsCollectionRef, {
            participantId: participantId, // 既存参加者のIDを使用
            name: member.名前,
            furigana: member.フリガナ,
            gender: member.性別,
            school: member.高校名,
            grade: member.学年,
            subject: member.参加学科,
            count: member.参加回数 + 1,
          });
  
        } else {
          // 新規参加者の場合
          // const participantId = uuidv4(); // UUIDは不要になりました
          // 1. participants コレクションに追加
          const newParticipantDocRef = await addDoc(
            collection(db, "participants"),
            {
              // participantId: participantId, // 自動生成IDに変更
              openCampusId: openCampusId,
              name: member.名前,
              furigana: member.フリガナ,
              gender: member.性別,
              school: member.高校名,
              grade: member.学年,
              count: 1, // 初回参加なので1
            }
          );
  
          // 2. pastEvents サブコレクションに新しいイベントを追加
          const pastEventsCollectionRef = collection(
            newParticipantDocRef,
            "pastEvents"
          );
          await addDoc(pastEventsCollectionRef, {
            openCampusId: openCampusId,
            date: date
              ? Timestamp.fromDate(new Date(date))
              : Timestamp.fromDate(new Date("2024-08-10")),
            grade: member.学年,
            subject: member.参加学科,
            count: 1,
            memo: "", // 新規参加者のためメモは空
          });
  
          // 3. openCampusesのparticipantsサブコレクションに追加
          await addDoc(participantsCollectionRef, {
            participantId: newParticipantDocRef.id, // 自動生成されたIDを使用
            name: member.名前,
            furigana: member.フリガナ,
            gender: member.性別,
            school: member.高校名,
            grade: member.学年,
            subject: member.参加学科,
            count: 1, // 初回参加
          });
  
          console.log(
            `New participant ${member.名前} added to collection 'participants'.`
          );
        }
      }
  
      // スタッフデータの登録・更新
      for (const staff of staffData) {
        const staffsCollectionRef = collection(docRef, "staffs");
        // 名前でスタッフを検索
        const staffsQuery = query(
          collection(db, "staffs"),
          where("name", "==", staff.名前)
        );
        const staffsSnapshot = await getDocs(staffsQuery);
  
        if (!staffsSnapshot.empty) {
          // 既存のスタッフが見つかった場合
          const staffDoc = staffsSnapshot.docs[0];
          const staffId = staffDoc.id;
  
          // pastEvents サブコレクションに新しいイベントを追加
          const pastEventsCollectionRef = collection(
            db,
            "staffs",
            staffId,
            "pastEvents"
          );
          await addDoc(pastEventsCollectionRef, {
            openCampusId: openCampusId,
            date: date
              ? Timestamp.fromDate(new Date(date))
              : Timestamp.fromDate(new Date("2024-08-10")),
            role: staff.役割,
          });
  
          console.log(
            `Staff ${staff.名前} updated in collection 'staffs'.`
          );
  
          // openCampusesのstaffsサブコレクションに追加
          await addDoc(staffsCollectionRef, {
            staffId: staffId, // 既存スタッフのIDを使用
            name: staff.名前,
            furigana: staff.フリガナ,
            gender: staff.性別,
            department: staff.学科名,
            grade: staff.学年,
            role: staff.役割,
          });
  
        } else {
          // 新規スタッフの場合
          // staffs コレクションに追加
          const newStaffDocRef = await addDoc(collection(db, "staffs"), {
            // staffId: staffId, // staffIdを自動生成に変更
            openCampusId: openCampusId,
            name: staff.名前,
            furigana: staff.フリガナ,
            gender: staff.性別,
            department: staff.学科名,
            grade: staff.学年,
          });
  
          // pastEvents サブコレクションに新しいイベントを追加
          const pastEventsCollectionRef = collection(
            newStaffDocRef,
            "pastEvents"
          );
          await addDoc(pastEventsCollectionRef, {
            openCampusId: openCampusId,
            date: date
              ? Timestamp.fromDate(new Date(date))
              : Timestamp.fromDate(new Date("2024-08-10")),
            role: staff.役割,
          });
  
          // openCampusesのstaffsサブコレクションに追加
          await addDoc(staffsCollectionRef, {
            staffId: newStaffDocRef.id, // 自動生成されたIDを使用
            name: staff.名前,
            furigana: staff.フリガナ,
            gender: staff.性別,
            department: staff.学科名,
            grade: staff.学年,
            role: staff.役割,
          });
  
          console.log(
            `New staff ${staff.名前} added to collection 'staffs'.`
          );
        }
      }
  
      console.log("Document written with ID: ", openCampusId);
      router.push("/openCampuses");
    } catch (e) {
      console.error("Error adding document: ", e);
      setError("オープンキャンパスの登録に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // 参加者データを表示するための関数
  const showParticipants = () => setDisplayData('participants');
  // スタッフデータを表示するための関数
  const showStaffs = () => setDisplayData('staffs');

  // 現在表示すべきデータを取得（参加者データ or スタッフデータ）
  const currentData = displayData === 'participants' ? importedData : staffData;


    return (
      <div className={styles.container}>
        <Header
          title={title}
          date={date}
          memo={memo}
          handleTitleChange={handleTitleChange}
          handleDateChange={handleDateChange}
          handleMemoChange={handleMemoChange}
        />
  
        <div className={styles.content}>
          <Table displayData={displayData} currentData={currentData} />
  
          <div className={styles.rightArea}>
            <ImportArea handleImport={handleImport} />
            <CountArea
              importedDataLength={importedData.length}
              staffDataLength={staffData.length}
              displayData={displayData}
              showParticipants={showParticipants}
              showStaffs={showStaffs}
            />
            <RegisterButton isLoading={isLoading} handleRegister={handleRegister} />
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>
      </div>
    );
  };
  
  export default OpenCampusesAdd;