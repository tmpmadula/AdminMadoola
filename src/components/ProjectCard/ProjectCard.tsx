import React from "react";
import {
  ProjectCardWrapper,
  ProjectInfo,
  ProjectTitle,
  ProjectWeight,
  ProjectMeta,
  OrderID,
  ProjectPriceWrapper,
  ProjectPrice,
  DiscountedPrice,
} from "./ProjectCard.style";
//import { useDrawerDispatch } from "../../context/DrawerContext";

type ProjectCardProps = {
  title: string;
  image: any;
  weight?: string;
  currency?: string;
  description?: string;
  price: number;
  salePrice?: number;
  orderId?: number;
  discountInPercent?: number;
  data: any;
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  image,
  weight,
  price,
  salePrice,
  discountInPercent,
  currency,
  data,
  orderId,
  ...props
}) => {
  return (
    <ProjectCardWrapper {...props} className="Project-card">
      <ProjectInfo>
        <ProjectTitle>{title}</ProjectTitle>
        <ProjectWeight>{weight}</ProjectWeight>

        <ProjectMeta>
          <ProjectPriceWrapper>
            <ProjectPrice>
              {currency}
              {salePrice && salePrice !== 0 ? salePrice : price}
            </ProjectPrice>

            {discountInPercent && discountInPercent !== 0 ? (
              <DiscountedPrice>
                {currency}
                {price}
              </DiscountedPrice>
            ) : null}
          </ProjectPriceWrapper>

          <OrderID>{orderId}</OrderID>
        </ProjectMeta>
      </ProjectInfo>
    </ProjectCardWrapper>
  );
};

export default ProjectCard;
