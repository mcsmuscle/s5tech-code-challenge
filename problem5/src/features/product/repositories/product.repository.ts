import { PrismaClient } from '@prisma/client';
import { CreateProductDTO, UpdateProductDTO } from '../types/product.types';

export class ProductRepository {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async findUnique(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async create(product: CreateProductDTO) {
    return this.prisma.product.create({
      data: product,
    });
  }

  async update(id: string, data: UpdateProductDTO) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async findMany({
    where,
    skip,
    take,
    orderBy,
  }: {
    where?: object;
    skip?: number;
    take?: number;
    orderBy?: object;
  }) {
    return this.prisma.product.findMany({
      where,
      skip,
      take,
      orderBy,
    });
  }

  async count(where?: object) {
    return this.prisma.product.count({
      where,
    });
  }
}
