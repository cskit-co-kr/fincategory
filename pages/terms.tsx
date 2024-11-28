import React from "react";
import { enUS } from "../lang/en-US";
import { koKR } from "../lang/ko-KR";
import { useRouter } from "next/router";

const HeadText = ({ children, className }: any) => (
  <div className={`text-base md:text-sm font-semibold ${className}`}>
    {children}
  </div>
);

const Text = ({ children, className }: any) => (
  <div className={` text-sm md:text-sm ${className}`}>{children}</div>
);

const Terms = () => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === "ko" ? koKR : enUS;
  return (
    <div
      style={{ letterSpacing: "-1px" }}
      className="w-full flex justify-center bg-white md:rounded-xl md:border md:border-gray-200 md:mt-7 lg:py-[30px]"
    >
      <div className="max-w-[1196px] w-full my-[20px]">
        <h1 className="leading-[26px] font-semibold text-[20px]">
          {t["이용약관"]}
        </h1>
        <HeadText className="pt-[30px] pb-[15px]">제1장 총칙</HeadText>

        <HeadText className="pt-[30px]">제1조 목적</HeadText>
        <Text className="pt-[11px] md:pt-[30px] pb-[15px]">
          이 약관은 핀카(이하 "회사"라 합니다)가 제공하는 서비스(이용자가 PC,
          멀티미디어 모바일 등의 각종 디지털기기 또는 프로그램을 통하여 이용할
          수 있도록 회사가 제공하는 모든 서비스를 의미합니다)와 관련하여, 회사와
          이용자간에 서비스 이용조건 및 절차, 권리ㆍ의무 및 책임사항 기타 필요한
          사항을 규정함을 목적으로 합니다.
        </Text>

        <HeadText className="pt-[30px]">제2조 약관의 효력과 변경</HeadText>
        <Text className="pt-[11px] md:pt-[30px]">
          ① 이 약관은 ”회사”가 제공하는 모든 인터넷서비스에 게시하여 공시합니다.
          "회사"는 "약관의 규제에 관한 법률", "정보통신망 이용촉진 및 정보보호
          등에 관한 법률" (이하 “정보통신망법”이라고 합니다) 등 관련법에
          위배하지 않는 범위에서 이 약관을 변경할 수 있으며, 회사는 약관이
          변경되는 경우에 변경된 약관의 내용과 시행일을 정하여, 그 시행일로부터
          최소7일 (이용자에게 불리하거나 중대한 사항의 변경은 30일) 이전부터
          시행일 후 상당한 기간 동안 공지하고, 기존 이용자에게는 변경된 약관,
          적용일자 및 변경사유(변경될 내용 중 중요사항에 대한 설명을 포함)를
          전자우편주소로 발송합니다. 변경된 약관은 공시하거나 고지한
          시행일로부터 효력이 발생합니다.
        </Text>
        <Text className="pt-[11px] md:pt-[30px] pb-[15px]">
          ② 이용자는 변경된 약관에 대해 동의하지 않을 권리가 있으며,
          시행일로부터 10일(이용자에게 불리하거나 중대한 사항의 변경인 경우에는
          30일) 내에 변경된 약관에 대해 거절의 의사를 표시하지 않았을 때에는 본
          약관의 변경에 동의한 것으로 간주합니다.
        </Text>

        <HeadText className="pt-[30px]">제3조 약관의 적용</HeadText>
        <Text className="pt-[11px] md:pt-[30px] pb-[15px]">
          이 약관에 명시되지 아니한 사항에 대하여는 별도의 세부 약관, 상관행,
          회사의 공지, 이용안내, 관계법령에서 정한 바에 따릅니다.
        </Text>

        <HeadText className="pt-[30px] pb-[15px]">
          제2장 이용계약의 체결
        </HeadText>

        <HeadText className="pt-[30px]">제4조 서비스의 구분</HeadText>
        <Text className="pt-[11px] md:pt-[30px]">
          ①"회사"가 이용자에게 제공하는 서비스는 무료서비스, 유료서비스 등으로
          구분합니다.
        </Text>
        <Text className="pt-[11px] md:pt-[30px] pb-[15px]">
          ② 무료서비스, 유료서비스 등의 종류와 이용방법 등은 이 약관 및 "회사"가
          공지 또는 이용안내에서 별도로 정하는 바에 의합니다.
        </Text>

        <HeadText className="pt-[30px]">
          제5조 이용계약의 성립 및 체결단위
        </HeadText>
        <Text className="pt-[11px] md:pt-[30px]">
          ① 이용계약은 이용자의 이용신청에 대한 "회사"의 이용승낙으로
          성립합니다.
        </Text>
        <Text className="pt-[11px] md:pt-[30px]">
          ② 이용계약은 아이디 단위로 체결합니다.
        </Text>
        <Text className="pt-[11px] md:pt-[30px] pb-[15px]">
          ③ "서비스"의 대량이용 등 특별한 "서비스" 이용에 관한 계약은 별도의
          계약으로 합니다.
        </Text>

        <HeadText className="pt-[30px]">제6조 이용신청</HeadText>
        <Text className="pt-[11px] md:pt-[30px]">
          ① 이용자가 "서비스"의 이용을 원할 경우 인터넷 접속 등의 방식으로
          "회사"가 소정의 가입신청 양식에서 요구하는 사항을 기입하여 이용신청을
          하여야 합니다.
        </Text>
        <Text className="pt-[11px] md:pt-[30px]">
          ② "회사"는 이 약관의 주요 내용을 이용자에게 고지하여야 합니다.
        </Text>
        <Text className="pt-[11px] md:pt-[30px] pb-[15px]">
          ③ 이용자가 전항의 고지 하단에 있는, 동의 버튼을 클릭하거나 또는
          체크박스에 체크하고 이용신청을 하는 것은 이 약관에 대한 동의로
          간주됩니다.
        </Text>

        <HeadText className="pt-[30px]">제7조 이용신청의 승낙</HeadText>
        <Text className="pt-[11px] md:pt-[30px]">
          ① "회사"는 다음 각호에 해당하는 이용신청에 대하여는 승낙을 하지 아니
          할 수 있습니다.
        </Text>
        <Text className="pt-[11px] md:pt-[30px]">
          ② "회사"는 이용신청을 승낙하는 때에는 다음 각호의 사항을 이용자에게
          "서비스"를 통하여 통지합니다.
        </Text>
        <Text className="pt-[11px] md:pt-[30px] pb-[15px]">
          1. 아이디 <br />
          2. 이용자의 권익보호 및 의무 등에 관한 사항 <br />
          3. 기타 이용자가 "서비스" 이용 時 알아야 할 사항
        </Text>

        <HeadText className="pt-[30px]">
          제8조 이용신청에 대한 불승낙과 승낙의 보류
        </HeadText>
        <Text className="pt-[11px] md:pt-[30px]">
          ① "회사"는 원칙적으로 이용자가 신청한대로 아이디를 부여합니다.
        </Text>
        <Text className="pt-[11px] md:pt-[30px]">
          1. 허위의 신청이거나 허위서류를 첨부한 경우
          <br />
          2. 이용자가 회사에 납부하여야 할 요금등을 납부하지 않은 경우
          <br />
          3. 기타 이용자의 귀책사유로 이용승낙이 곤란한 경우
        </Text>
        <Text className="pt-[11px] md:pt-[30px]">
          ② "회사"는 다음 각호에 해당하는 사유가 있는 경우에는 그 사유가 해소될
          때까지는 승낙을 보류할 수 있습니다.
        </Text>
        <Text className="pt-[11px] md:pt-[30px] pb-[15px]">
          1. 회사의 설비에 여유가 없는 경우
          <br />
          2. "서비스"에 장애가 있는 경우
        </Text>

        <HeadText className="pt-[30px]">제9조 아이디 부여등</HeadText>
        <Text className="pt-[11px] md:pt-[30px]">
          ① "회사"는 원칙적으로 이용자가 신청한대로 아이디를 부여합니다.
        </Text>
        <Text className="pt-[11px] md:pt-[30px]">
          ② 아이디는 변경할 수 없는 것을 원칙으로 합니다.
        </Text>
        <Text className="pt-[11px] md:pt-[30px] pb-[15px]">
          ③ 아이디 또는 닉네임이 제12조 제6항 각호에 해당하는 경우에는 "회사"는
          해당 이용자에 대한 "서비스" 제공을 중단하고, 새로운 아이디 또는
          닉네임으로 이용신청 할 것을 권할 수 있습니다.
        </Text>

        <HeadText className="pt-[30px] pb-[15px]">
          제3장 계약당사자의 의무
        </HeadText>

        <HeadText className="pt-[30px]">제10조 회사의 의무</HeadText>
        <Text className="pt-[11px] md:pt-[30px]">
          ①"회사"는 이용자로부터 제기되는 의견이나 불만이 정당하다고 인정할
          경우에는 즉시 처리하여야 합니다. 다만, 즉시 처리가 곤란한 경우에는
          이용자에게 그 사유와 처리일정을 1:1답변 또는 전자우편등으로 통보하여야
          합니다.
        </Text>
        <Text className="pt-[11px] md:pt-[30px]">
          ② "회사"는 설비에 장애·멸실 등의 사유가 발생하여 수리 또는 복구가
          필요하거나 계속적이고 안정적인 "서비스"의 제공을 위하여 필요한 경우
          서비스의 전부 또는 일부의 제공을 일시 중지할 수 있습니다. 이 경우
          회사는 그 사유, 중지 기간, 대응 현황, 상담 가능한 연락처 등을
          이용자에게 공지합니다. 다만, 다음 각 호와 같이 사전에 공지할 수 없는
          부득이한 사정이 있는 경우 사후 공지 또는 이용자들에게 개별 고지
          합니다.
        </Text>
        <Text className="pt-[11px] md:pt-[30px] ">
          1. 회사가 긴급한 시스템 점검, 증설, 교체, 시설의 보수 또는 공사를 하기
          위하여 부득이한 경우 <br />
          2. 시스템 또는 기타 서비스 설비의 장애, 서비스 이용폭주,
          기간통신사업자의 설비 보수 또는 점검, 유무선 네트워크 장애 등으로
          정상적인 서비스 제공이 불가능한 경우
          <br />
          3. 천재지변, 국가비상사태, 정전 등 회사가 통제할 수 없는 불가항력적
          사유로 인한 경우
        </Text>
        <Text className="pt-[11px] md:pt-[30px]">
          ③ "회사"는 이용계약의 체결, 계약사항의 변경 및 해지 등 이용자와의
          계약관련 절차 및 내용 등에 있어 이용자에게 편의를 제공하도록
          노력합니다.
        </Text>
        <Text className="pt-[11px] md:pt-[30px] pb-[15px]">
          ④ “회사”는 대표자의 성명, 상호, 주소, 전화번호, 모사전송번호(FAX),
          통신판매업 신고번호, 이용약관, 개인정보취급방침 등을 이용자가 쉽게 알
          수 있도록 온라인 서비스 초기화면에 게시합니다.
        </Text>

        <HeadText className="pt-[30px]">제11조 개인정보보호</HeadText>
        <Text className="pt-[11px] md:pt-[30px] pb-[15px]">
          "회사"는 이용자들의 개인정보를 중요시하며, 정보통신망법,
          개인정보보호법, 전기통신사업법 등 관련 법규를 준수하고 있습니다.
          "회사"는 개인정보보호방침을 통하여 이용자가 제공하는 개인정보가 어떠한
          용도와 방식으로 이용되고 있으며 개인정보보호를 위해 어떠한 조치가
          취해지고 있는지 알려드립니다.
        </Text>

        <HeadText className="pt-[30px]">제12조 이용자의 의무</HeadText>
        <Text className="pt-[11px] md:pt-[30px]">
          ① 이용자는 회원가입을 통해 이용신청을 할 경우 사실에 근거하여
          작성하여야 합니다. 이용자가 허위, 또는 타인의 정보를 등록한 경우
          회사에 대하여 일체의 권리를 주장할 수 없으며, 회사는 이로 인하여
          발생하는 손해에 대하여 책임을 부담하지 않습니다.
        </Text>
        <Text className="pt-[11px] md:pt-[30px]">
          ② 이용자는 본 약관에서 규정하는 사항과 기타 회사가 정한 제반 규정,
          회사가 공지하는 사항을 준수하여야 합니다. 또한 이용자는 회사의 업무에
          방해가 되는 행위, 회사의 명예를 손상시키는 행위를 해서는 안됩니다.
        </Text>
        <Text className="pt-[11px] md:pt-[30px]">
          ③ 이용자는 청소년 보호법, 표시ㆍ광고의 공정화에 관한 법률, 정보통신망
          이용촉진 및 정보보호 등에 관한 법률 등 관계 법령을 준수하여야 합니다.
          이를 위반하는 경우 해당 법령에 의거 형사 처벌 및 회사의 운영정책에
          따른 제재가 이루어질 수 있습니다.
        </Text>
        <Text className="pt-[11px] md:pt-[30px]">
          ④ 이용자는 주소, 연락처, 전자우편 주소 등 이용계약 사항이 변경된
          경우에 즉시 온라인 상에서 이를 수정해야 합니다. 수정을 하지 않거나
          수정 지연으로 발생되는 책임은 이용자에게 있습니다
        </Text>
        <Text className="pt-[11px] md:pt-[30px]">
          ⑤ 이용자는 서비스 아이디와 비밀번호를 직접 관리해야 합니다. 이용자의
          관리 소홀로 발생한 문제는 회사에서 책임지지 않습니다.
        </Text>
        <Text className="pt-[11px] md:pt-[30px]">
          1. 회사가 제공하는 서비스의 공식 운영자를 사칭하거나 유사한 명칭을
          사용하여 다른 이용자에게 혼란을 초래하는 행위 <br /> 2. 선정적이고
          음란한 내용이 포함된 명칭의 사용
          <br /> 4. 비어, 속어라고 판단되거나 반사회적이고 공서양속을 해치는
          내용이 포함된 명칭의 사용 <br /> 5. 주민등록번호, 전화번호 등 개인정보
          유출 또는 사생활 침해의 우려가 있는 경우 <br /> 6. 관계법령에
          저촉되거나 기타 이용자의 보호를 위한 합리적인 사유가 있는 경우
        </Text>
        <Text className="pt-[11px] md:pt-[30px]">
          ⑥ 이용자가 아이디, 닉네임, 기타 서비스 내에서 사용되는 명칭 등의 선정
          시에는 다음 각 호에 해당하는 내용을 사용하여서는 안됩니다.
        </Text>
        <Text className="pt-[11px] md:pt-[30px]">
          ⑦ 이용자는 회사의 명시적 동의가 없는 한 서비스 이용 권한, 기타 이용
          계약상의 지위를 타인에게 매도, 증여할 수 없으며 무형자산을 담보로
          제공할 수 없습니다.
        </Text>
        <Text className="pt-[11px] md:pt-[30px]">
          ⑧ 이용자는 회사에서 제공하는 서비스를 본래의 이용목적 이외의 용도로
          사용해서는 안됩니다. 이용자는 아래 각 호의 행위를 하여서는 안되며,
          이에 해당되는 행위를 할 경우에는 본 약관 및 각 서비스 별로 공지하는
          운영정책에 따라 이용자의 서비스 이용을 제한하거나 계정의 삭제,
          수사기관의 고발 조치 등 적법한 조치를 포함한 제재를 가할 수 있습니다.
        </Text>
        <Text className="pt-[11px] md:pt-[30px] pb-[15px]">
          1. 회원 가입 또는 변경 시 개인정보에 허위 내용을 기재하는 행위 <br />
          2. 타인의 개인 정보를 도용하거나 부정하게 사용하는 행위 <br />
          3. 이용자의 아이디 등 사이버 자산을 타인과 매매하는 행위
          <br />
          4. 회사의 운영진 또는 직원을 사칭하는 행위
          <br />
          5. 회사 프로그램 상의 버그를 악용하는 행위
          <br />
          6. 회사의 사전 승낙 없이 서비스를 이용하여 영업활동을 하는 행위
          <br />
          7. 다른 이용자를 희롱 또는 위협하거나 다른 이용자에게 고통, 피해, 또는
          불편을 주는 행위
          <br />
          8. 회사로부터 승인 받지 아니하고 각 서비스의 클라이언트 프로그램을
          변경하거나, 서버를 해킹하거나 또는 웹사이트의 일부분을 변경하는 행위,
          또는 이러한 목적으로 개발, 유포되는 프로그램을 사용하거나 이의 사용을
          장려 또는 광고하는 행위
          <br />
          9. 시청 또는 광고 조회수 조작, 기타 부정한 목적으로 다량의 정보를
          전송하여 서비스의 안정적인 운영을 방해하는 행위
          <br />
          10. 회사 또는 다른 이용자의 게시물, 영상 기타 광고의 전송을 방해하거나
          훼손, 삭제하는 행위
          <br />
          11. 회사의 승인을 받지 않고 다른 이용자의 개인정보를 수집 또는
          저장하는 행위
          <br />
          12. 수신자의 의사에 반하는 광고성 정보, 전자우편을 지속적으로 전송하는
          경우
        </Text>
      </div>
    </div>
  );
};

export default Terms;
