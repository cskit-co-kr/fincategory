import React from "react";

const HeadText = ({ children, className }: any) => (
  <div className={`text-sm font-semibold ${className}`}>{children}</div>
);

const Text = ({ children, className }: any) => (
  <div className={`md:leading-[33px] text-xs md:text-sm ${className}`}>{children}</div>
);

const PrivacyPolicy = () => {
  return (
    <div
      style={{ letterSpacing: "-1px" }}
      className='w-full flex justify-center bg-white md:rounded-xl md:border md:border-gray-200 md:mt-7 lg:p-[30px]'
    >
      <div className='max-w-[1196px] w-full my-[20px]'>
        <h1 className='leading-[26px] font-semibold text-[20px] mb-[14px] lg:mb-[30px]'>개인정보처리방침</h1>
        <Text className='pb-[15px]'>
          핀카(이하 '회사'라 합니다)는 고객님의 개인정보를 중요시하며, "정보통신망 이용촉진 및 정보보호"에 관한 법률을
          준수하고 있습니다. 회사는 개인정보취급방침을 통하여 고객님께서 제공하시는 개인정보가 어떠한 용도와 방식으로
          이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드리며 이에 회원은 제공된 개인 정보를
          아래에 기재된 수집목적과 이용 목적에 따라 수집, 활용함에 동의해야합니다. 회사의 개인정보취급방침은 다음과 같은
          내용을 담고 있습니다.
        </Text>

        <HeadText className='pt-[30px]'>1. 회원 본인이 기재한 개인정보 내용</HeadText>
        <Text className='pt-[11px] md:pt-[30px] pb-[15px]'>
          필수항목 : 회원 아이디, 회원 비밀번호, 닉네임, 이메일, 유튜브 채널아이디 수집방법 : 홈페이지(회원가입)
        </Text>

        <HeadText className='pt-[30px]'>2. 개인정보 수집에 대한 동의</HeadText>
        <Text className='pt-[11px] md:pt-[30px] pb-[15px]'>
          회사는 이용자들이 회사의 개인정보 보호정책 또는 이용약관의 내용에 대하여 공지 하고 회원 가입 시 동의한 것으로
          간주한다
        </Text>

        <HeadText className='pt-[30px]'>3. 개인정보의 수집목적 및 이용목적</HeadText>
        <Text className='pt-[11px] md:pt-[30px]'>
          ‘개인정보’라 함은 생존하는 개인에 관한 정보로서 정보에 포함되어 있는 성명, 휴대폰번호 등의 사항에 의해 당해
          개인을 식별할 수 있는 정보를 말한다. 대부분의 서비스는 별도의 사용자 등록이 없이 언제든지 사용할 수 있다.
          다만, 회사는 무료/유료 서비스 등을 통해 이용자들에게 맞춤식 서비스와 더 향상된 양질의 서비스를 제공하기 위해
          이용자 개인의 정보를 수집하고 있다.
        </Text>
        <Text className='pt-[17px] pl-[20px]'>
          {" "}
          <span className='-ml-2'>&#x2022;</span> 회사가 다양한 서비스 제공을 위해 아래의 목적으로 이용된다.
        </Text>
        <Text className='pt-[17px] pl-[10px] pb-[15px]'>
          1) 제공된 개인정보는 회사가 제공하는 조회 등 일반 서비스 및 각종 이벤트. 컨텐츠 제공의 전달 수단 및 개인성향
          분석, 통계적 수치 등을 통한 일반 마케팅에 활용한다.
          <br />
          2) 성명, 휴대폰번호, 회원 아이디 등의 수집은 회원에게 제공되는 제반 서비스 이용에 따른 본인 확인 절차에
          이용한다.
          <br />
          3) 또한, 공지사항 전달, 불만처리, 알림 문자서비스 등 원활한 의사소통 경로로 이용한다. <br />
          4) 회사에 회원 본인이 기재한 개인정보는 개인맞춤 서비스를 제공하기 위해 수집되는 자료로 이용한다.
        </Text>

        <HeadText className='pt-[30px]'>4. 개인정보 제3자 제공 및 공유</HeadText>
        <Text className='pt-[11px] md:pt-[30px]'>
          ‘개인정보’라 함은 생존하는 개인에 관한 정보로서 정보에 포함되어 있는 성명, 휴대폰번호 등의 사항에 의해 당해
          개인을 식별할 수 있는 정보를 말한다. 대부분의 서비스는 별도의 사용자 등록이 없이 언제든지 사용할 수 있다.
          다만, 회사는 무료/유료 서비스 등을 통해 이용자들에게 맞춤식 서비스와 더 향상된 양질의 서비스를 제공하기 위해
          이용자 개인의 정보를 수집하고 있다.
        </Text>
        <Text className='pt-[17px] pl-[20px]'>
          {" "}
          <span className='-ml-2'>&#x2022;</span> 개인정보는 제3자에게 제공 및 공개하지 않음을 원칙으로 하지만, 회원이
          공개에 동의한 경우나 아래와 같은 경우는 예외로 한다.
        </Text>
        <Text className='pt-[17px] pl-[10px] pb-[15px]'>
          1) 회사의 회원관리 담당직원이 고객의 요청 시 동의 후, 회원 내역을 조회, 이용안내 서비스 등의 업무 전달을 위한
          서비스 지원 업무에 필요한 개인 정보를 지원한다.
          <br />
          2) 회원의 지원 서비스 등의 전산 프로그램 개발 유지 보수 등에 관한 용역 계약을 체결하고 그 회사가 계약된 업무를
          수행하는 경우에 제공한다.
          <br />
          3) 회사와 제휴시간에 공동 이벤트 기간 동안 수집된 정보의 전부 또는 일부를 제휴사와 공유할 수 있으며 회원에
          관한 개인정보를 전송, 수집하기 전에 회원에게 그러한 사항을 공지 및 동의 절차를 거쳐서 제공할 수 있다.
        </Text>

        <HeadText className='pt-[30px]'>5. 개인정보 보유 유효기간</HeadText>
        <Text className='pt-[11px] md:pt-[30px] pb-[15px]'>
          개인정보의 이용 및 보유기간은 회원가입시를 기점으로 하여 탈회 후 파기하는 것을 원칙으로 하되, 아래와 같은
          경우는 예외로 한다.
        </Text>

        <Text className='pt-[17px] pl-[20px] pb-[15px]'>
          1) 충분한 법률적 근거가 필요한 경우 관계 법령에 적시된 보존기간 동안 보존한다.
          <br />
          2) 계약 또는 청약철회 등에 관한 기록 : 5년
          <br />
          3) 대금결제 및 재화 등의 공급에 관한 기록 : 5년 <br />
          4) 소비자의 불만 또는 분쟁처리에 관한 기록 : 3년
        </Text>
        <HeadText className='pt-[30px]'>
          6. 개인정보 제공 동의 거부 권리 및 동의 거부 따른 불이익 내용 또는 제한사항
        </HeadText>
        <Text className='pt-[11px] md:pt-[30px] pb-[15px]'>
          귀하는 개인정보 제공 동의를 거부할 권리가 있으며 동의 거부에 따른 불이익은 없으나, 회사에서 제공되는 일체의
          안내 및 공지에 관한 서비스를 받을 수 없다.
        </Text>

        <HeadText className='pt-[30px]'>7. 개인정보의 파기 절차 및 방법</HeadText>
        <Text className='pt-[11px] md:pt-[30px]'>파기절차</Text>
        <Text className='pt-[17px] pl-[20px]'>
          {" "}
          <span className='-ml-2'>&#x2022;</span> 회원님이 회원가입 등을 위해 입력하신 정보는 목적이 달성된 후 회원정보
          DB에서 내부 방침 기타 관련 법령에 의한 정보보호 사유에 따라 일정 기간 저장된 후 파기된다. 동 개인정보는 법률에
          의한 경우가 아니고서는 다른 목적으로 이용되지 않는다.
        </Text>
        <Text className='pt-[11px] md:pt-[30px]'>파기방법</Text>
        <Text className='pt-[17px] pl-[20px]'>
          {" "}
          <span className='-ml-2'>&#x2022;</span> 전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적
          방법을 사용하여 삭제
        </Text>
        <Text className='pt-[17px] pl-[20px] mb-[15px]'>
          {" "}
          <span className='-ml-2'>&#x2022;</span> 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기
        </Text>

        <HeadText className='pt-[30px]'>8. 이용자 및 법정대리인의 권리와 그 행사방법</HeadText>
        <Text className='pt-[17px] pl-[20px]'>
          {" "}
          <span className='-ml-2'>&#x2022;</span> 이용자 및 법정 대리인은 언제든지 등록되어 있는 자신 혹은 당해 만 14세
          미만 아동의 개인정보를 조회하거나 수정할 수 있으며, 가입 해지를 요청할 수 있습니다. 이용자 혹은 만 14세 미만
          아동의 개인정보 조회, 수정을 위해서는 ‘개인정보변경’을 가입 해지 휘해서는 ‘회원탈퇴’를 통해 본인 확인 절차를
          거쳐 직접 열람, 정정 또는 탈퇴가 가능합니다.
        </Text>
        <Text className='pt-[17px] pl-[20px] mb-[15px]'>
          {" "}
          <span className='-ml-2'>&#x2022;</span> 회사는 이용자 혹은 법정 대리인의 요청에 의해 해지 또는 삭제된
          개인정보는 ‘개인정보의 보유 및 이용기간’에 명시된 바에 따라 처리하고 그 외의 용도로 열람 또는 이용할 수 없도록
          처리하고 있다.
        </Text>

        <HeadText className='pt-[30px]'>9. 개인정보에 관한 민원 서비스</HeadText>
        <Text className='pt-[11px] md:pt-[30px] pb-[15px]'>
          회사는 고객의 개인정보를 보호라고 개인정보과 관련한 불만을 처리하기 위해 아래와 같이 개인정보 책임자를
          지정하고 있다.
        </Text>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
