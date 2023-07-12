import React, { FC } from "react";
import { PageWrapper } from "../../components/PageWrapper";
import { Card, Divider } from "antd";
import { linkedInProfiles } from "../../components/PageWrapper/AseFooter";
import Title from "antd/es/typography/Title";

const Imprint: FC = () => {
  return (
    <PageWrapper compact>
      <Card>
        <Title level={4}>Imprint / LinkedIn</Title>
        <Divider />
        {linkedInProfiles.map((profile) => (
          <div key={profile.url}>
            <a href={profile.url}>{profile.name}</a>
          </div>
        ))}
      </Card>
    </PageWrapper>
  );
};

export default Imprint;
